import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from './user-auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Not logged in so redirect to login page with the return url
  router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  return false;
};

export const ownerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isOwner()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Not logged in so redirect to login page
  router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  return false;
};
