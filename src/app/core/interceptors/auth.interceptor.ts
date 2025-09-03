import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { ErrorService } from '../services/error.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && !request.url.includes('/auth/')) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        errorService.addHttpError(401, 'Session expirée. Veuillez vous reconnecter.', request.url);
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorService.addHttpError(403, 'Accès refusé. Permissions insuffisantes.', request.url);
      } else if (error.status >= 500) {
        errorService.addHttpError(
          error.status,
          'Erreur serveur. Veuillez réessayer plus tard.',
          request.url,
        );
      } else if (error.status >= 400) {
        errorService.addHttpError(
          error.status,
          'Erreur de requête. Vérifiez vos données.',
          request.url,
        );
      }

      return throwError(() => error);
    }),
  );
};
