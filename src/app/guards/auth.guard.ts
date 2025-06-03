import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  
  const token = sessionStorage.getItem('token');

  if (token) {
    return true;
  }

  const router = inject(Router);
  router.navigate(['/access-non-authoriser']);
  return false;
};
