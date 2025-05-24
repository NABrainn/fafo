import {CanActivateFn, Router} from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import {map, tap} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifyToken().pipe(
    tap((verified: boolean) => {
      if (!verified) {
        authService.logout().subscribe({
          next: () => {
            router.navigate(['/logowanie']);
          },
          error: () => {
            router.navigate(['/logowanie']);
          }
        });
      }
    }),
    map((verified: boolean) => verified ? true : router.createUrlTree(['/logowanie']))
  );};
