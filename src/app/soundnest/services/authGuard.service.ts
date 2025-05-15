import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from './user-auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (authService.isOwner() && router.url.startsWith('/user')) {
      router.navigate(['/owner/dashboard']);
      return false;
    }

    return true;
  }

  if (router.url !== '/') {
    router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  } else {
    router.navigate(['/login']);
  }
  return false;
};

export const ownerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isOwner()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    router.navigate(['/user/dashboard']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};
