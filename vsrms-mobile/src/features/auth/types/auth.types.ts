export interface User {
  id: string; // backend now returns 'id' string from jsonFormatter
  email: string;
  fullName?: string;
  role: 'customer' | 'workshop_owner' | 'workshop_staff' | 'admin';
  workshopId?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone?:    string;
  password:  string;
  role:      string;
}

export interface AuthResponse {
  access_token:  string;
  id_token?:     string;
  refresh_token?: string;
  expires_in?:    number;
  user?:          any;
}
