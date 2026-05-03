export const ASGARDEO_ORG = process.env.EXPO_PUBLIC_ASGARDEO_ORG_NAME;  
export const ASGARDEO_BASE=`https://api.asgardeo.io/t/${ASGARDEO_ORG}`;

export const ASGARDEO_CONFIG = {
  clientId: process.env.EXPO_PUBLIC_ASGARDEO_CLIENT_ID ?? '',
  redirectUri: process.env.EXPO_PUBLIC_ASGARDEO_REDIRECT_URI ?? '',
  scopes: ['openid', 'profile', 'email','internal_login'],
};

export const ASGARDEO_ENDPOINTS= {
  authorize: `${ASGARDEO_BASE}/oauth2/authorize`,
  authn:`${ASGARDEO_BASE}/oauth2/authn`,
  token:`${ASGARDEO_BASE}/oauth2/token`,
  userInfo:`${ASGARDEO_BASE}/oauth2/userinfo`,
  scim:`${ASGARDEO_BASE}/scim2/Users`, 
};
console.log('Config:', ASGARDEO_CONFIG);
console.log('Endpoints:', ASGARDEO_ENDPOINTS);