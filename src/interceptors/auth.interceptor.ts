import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from '../services/error-notification.service';

const username = 'SOD';
const password = 'progens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorNotificationService);

  const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  const authReq = req.clone({
    setHeaders: { Authorization: authHeader }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/api/')) {
        let apiError: { blad?: string; opis?: string; serwis?: string } | undefined;

        try {
          const body = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
          if (body && (body.blad !== undefined || body.serwis !== undefined)) {
            apiError = { blad: body.blad, opis: body.opis, serwis: body.serwis };
          }
        } catch {
          // not a structured API error
        }

        const statusMsg = error.status ? ` (${error.status})` : '';
        const message = apiError?.blad || `Błąd komunikacji z serwerem${statusMsg}`;
        errorService.showError(message, undefined, apiError);
      }

      return throwError(() => error);
    })
  );
};
