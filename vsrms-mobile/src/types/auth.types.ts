export interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'STAFF';
  persona?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
