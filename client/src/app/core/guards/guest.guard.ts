import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guest Guard - Prevents authenticated users from accessing guest-only routes
 * Redirects to home page if user is already authenticated
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // User is already authenticated, redirect to home
  router.navigate(['/']);
  return false;
};
