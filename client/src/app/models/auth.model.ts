/**
 * Auth-related models and interfaces
 */

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthToken {
  type: string;
  value: string;
  expiresAt?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  uid: string; // username or email
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: AuthToken;
  };
  errors?: Record<string, string[]>;
}

export interface MeResponse {
  success: boolean;
  data?: {
    user: User;
  };
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
