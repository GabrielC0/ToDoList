import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const loadingService = inject(LoadingService);

  if (!request.url.includes('/auth/')) {
    loadingService.incrementRequestCount();
  }

  return next(request).pipe(
    finalize(() => {
      if (!request.url.includes('/auth/')) {
        loadingService.decrementRequestCount();
      }
    }),
  );
};
