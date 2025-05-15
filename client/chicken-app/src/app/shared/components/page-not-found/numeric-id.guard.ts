import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const numericIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const id = route.paramMap.get('id');
  if(id) {
    const isNumeric = /^\d+$/.test(id);
    if (!isNumeric) {
      router.navigate(['/404']);
      return false;
    }
    return true;
  }
  return false;
};
