import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    });
    return next(cloned);
  }

  const defaultCloned = req.clone({
    setHeaders: {
      Accept: 'application/json',
    }
  });

  return next(defaultCloned);
};
