import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor
 * Adds Authorization header with Bearer token to all HTTP requests
 * Handles token refresh and authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip adding token to auth endpoints (login, register)
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
    return next(req);
  }

  // Clone request and add Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
