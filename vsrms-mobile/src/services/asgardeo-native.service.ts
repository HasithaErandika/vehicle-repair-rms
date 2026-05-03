import { ASGARDEO_CONFIG, ASGARDEO_ENDPOINTS } from './asgardeo.config';
import * as Crypto from 'expo-crypto';

interface AuthFlowInit {
  flowId: string;
  authenticatorId: string;
  codeVerifier: string;
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

// ------------------- PKCE  ─────────────────────────────────────────────────────────────
function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ─── Safe JSON parse helper ───────────────────────────────────────────────────
async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) {
    throw new Error(`Empty response from Asgardeo (status ${res.status}). Check endpoint and config.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    console.error('[Asgardeo] Non-JSON response body:', text.substring(0, 200));
    throw new Error(`Server returned non-JSON (status ${res.status}). Check your Asgardeo config and endpoints.`);
  }
}



function extractAuthenticatorId(data: any): string {
  if (data?.authData?.error) {
    throw new Error(data.authData.error_description ?? data.authData.error);
  }

  if (data?.flowStatus === 'SUCCESS_COMPLETED') {
    return '__SUCCESS_COMPLETED__';
  }

  const authenticators: any[] = data?.nextStep?.authenticators ?? [];

  if (authenticators.length === 0) {
    console.error(
      '[Asgardeo] Unexpected authorize response — no authenticators found.\n' +
      'Full response: ' + JSON.stringify(data, null, 2)
    );
    throw new Error(
      `No authenticator returned from Asgardeo (flowStatus: ${data?.flowStatus ?? 'unknown'}). ` +
      'Check the console for the full response.'
    );
  }

  const basicAuth = authenticators.find(
    (a: any) =>
      a.authenticator === 'BasicAuthenticator' ||
      a.authenticator === 'basic' ||
      a.idp === 'LOCAL',
  );

  const chosen = basicAuth ?? authenticators[0];

  console.log('[Asgardeo] Using authenticator:', chosen.authenticator, '/', chosen.authenticatorId);
  return chosen.authenticatorId;
}

// ─── Step 1: Initiate auth flow (with PKCE) ───────────────────────────────────
export async function initiateAuthFlow(): Promise<AuthFlowInit> {
  const codeVerifier  = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id:             ASGARDEO_CONFIG.clientId,
    response_type:         'code',
    redirect_uri:          ASGARDEO_CONFIG.redirectUri,
    scope:                 ASGARDEO_CONFIG.scopes.join(' '),
    state:                 generateState(),
    response_mode:         'direct',
    code_challenge:        codeChallenge,
    code_challenge_method: 'S256',
    prompt:                'login',
  });

  const res = await fetch(ASGARDEO_ENDPOINTS.authorize, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':        'application/json',
    },
    body: params.toString(),
  });

  const data = await safeJson(res);
  console.log('[Asgardeo] authorize response:', JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(data?.message ?? 'Failed to initiate auth flow');
  }

  const authenticatorId = extractAuthenticatorId(data);

  if (authenticatorId === '__SUCCESS_COMPLETED__') {
    const code = data?.authData?.code;
    if (!code) throw new Error('SSO session reuse: SUCCESS_COMPLETED but no code returned');
    return { flowId: '__SKIP__', authenticatorId: '__SUCCESS_COMPLETED__', codeVerifier };
  }

  return { flowId: data.flowId, authenticatorId, codeVerifier };
}

// ─── Step 2: Submit credentials ───────────────────────────────────────────────
export async function submitCredentials(
  flowId: string,
  authenticatorId: string,
  username: string,
  password: string,
): Promise<string> {
  const res = await fetch(ASGARDEO_ENDPOINTS.authn, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':        'application/json',
    },
    body: JSON.stringify({
      flowId,
      selectedAuthenticator: {
        authenticatorId,
        params: { username, password },
      },
    }),
  });

  const data = await safeJson(res);
  console.log('[Asgardeo] authn response:', JSON.stringify(data, null, 2));

  if (!res.ok || data?.flowStatus !== 'SUCCESS_COMPLETED') {
    const msg = data?.authData?.error_description
      ?? data?.message
      ?? 'Invalid username or password';
    throw new Error(msg);
  }

  const code = data?.authData?.code;
  if (!code) throw new Error('No authorization code returned from Asgardeo');

  return code;
}

// ─── Step 3: Exchange code for token (with code_verifier) ─────────────────────
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
): Promise<{ access_token: string; id_token?: string }> {
  const params = new URLSearchParams({
    grant_type:    'authorization_code',
    client_id:     ASGARDEO_CONFIG.clientId,
    redirect_uri:  ASGARDEO_CONFIG.redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  const res = await fetch(ASGARDEO_ENDPOINTS.token, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString(),
  });

  const data = await safeJson(res);
  console.log('[Asgardeo] token response:', JSON.stringify(data));

  if (!res.ok || !data.access_token) {
    throw new Error(data?.error_description ?? 'Token exchange failed');
  }

  return { access_token: data.access_token, id_token: data.id_token };
}