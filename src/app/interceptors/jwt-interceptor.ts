import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { API } from '../config/api.config';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Don't attach token to login request
  if (
    req.url.includes(`/${API.auth.login}`) ||
    req.url.includes(`/${API.auth.refresh}`) ||
    req.url.includes(`/${API.auth.register}`)
  ) {
    return next(req);
  }

  let authRequest = req;

  if (token) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authRequest);
  }

  return next(req);
};
