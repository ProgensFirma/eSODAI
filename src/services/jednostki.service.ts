import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { TJednostka } from '../models/typy-info.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JednostkiService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/jednostki`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getJednostki(): Observable<TJednostka[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.get<TJednostka[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching jednostki:', error);

        if (!environment.production) {
          return of([]);
        } else {
          this.errorService.showError(
            'Błąd pobierania jednostek',
            'Nie udało się pobrać listy jednostek z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }
}
