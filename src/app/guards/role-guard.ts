import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const requiredRole = route.data['role'];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.role === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
