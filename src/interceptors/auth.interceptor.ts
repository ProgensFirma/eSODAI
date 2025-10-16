import { HttpInterceptorFn } from '@angular/common/http';

const username = 'SOD';
const password = 'progens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  const authReq = req.clone({
    setHeaders: {
      Authorization: authHeader
    }
  });

  return next(authReq);
};
