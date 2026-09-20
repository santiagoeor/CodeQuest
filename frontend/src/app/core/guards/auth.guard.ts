import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already authenticated in memory
  if (authService.isAuthenticated()) {
    return true;
  }

  // If token is stored, verify session before deciding
  const token = authService.getToken();
  if (token) {
    return authService.loadCurrentUser().pipe(
      map((user) => {
        if (user) {
          return true;
        }
        return router.createUrlTree(['/'], {
          queryParams: { returnUrl: state.url },
        });
      })
    );
  }

  // Not authenticated, redirect to home/login
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url },
  });
};
