import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session.service';
import { UserRole } from './models';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (session.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);
  return session.isAuthenticated() ? router.createUrlTree(['/dashboard']) : true;
};

export function roleGuard(...roles: UserRole[]): CanActivateFn {
  return () => {
    const session = inject(SessionService);
    const router = inject(Router);
    if (!session.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }
    return session.hasAnyRole(...roles) ? true : router.createUrlTree(['/dashboard']);
  };
}
