import { http } from './httpClient';
import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth';

export const authService = {
  login: (payload: LoginPayload) =>
    http<LoginResponse>(
      { 
        url: '/api/token/',
        method: 'POST',
        body: payload,
        requiresAuth: false
     }
    ),
  logout: () => {
    // JWT doesn't have logout endpoint - just clear local storage
    return Promise.resolve();
  },
  dashboard: () => {
    // Since there's no dashboard endpoint, we'll decode JWT to get user info
    // For now, return minimal user data from token
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No token');
    
    // Decode JWT payload (middle section of token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Promise.resolve({
        username: payload.username || payload.sub || 'user',
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      } as AuthUser);
    } catch {
      throw new Error('Invalid token');
    }
  },
};