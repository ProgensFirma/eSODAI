import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private username = 'SOD';
  private password = 'progens';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = 'Basic ' + btoa(`${this.username}:${this.password}`);

    // klonujemy request z nowymi nagłówkami
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });

    return next.handle(authReq);
  }
}
