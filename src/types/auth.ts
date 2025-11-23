export interface AuthUser {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  ldap_info?: Record<string, string>;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// JWT API response format
export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface DashboardPayload extends AuthUser {}