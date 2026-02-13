import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { EdoreczPunktNadawczy } from '../models/edorecz-punkt-nadawczy.model';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EdoreczKopertaService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorNotificationService);
  private useMockData = true;

  private mockPunktyNadawcze: EdoreczPunktNadawczy[] = [
    {
      numer: 1,
      nazwa: 'Punkt Nadawczy - Wydział Administracyjny',
      domyslny: true,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    {
      numer: 2,
      nazwa: 'Punkt Nadawczy - Wydział Finansowy',
      domyslny: false,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    {
      numer: 3,
      nazwa: 'Punkt Nadawczy - Sekretariat',
      domyslny: false,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    }
  ];

  getPunktyNadawcze(): Observable<EdoreczPunktNadawczy[]> {
    if (this.useMockData) {
      return of(this.mockPunktyNadawcze);
    }

    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<EdoreczPunktNadawczy[]>(`${apiUrl}/eDorecz/PunktyNadawcze`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching punkty nadawcze:', error);

        if (!environment.production) {
          return of(this.mockPunktyNadawcze);
        } else {
          this.errorService.showError(
            'Błąd pobierania punktów nadawczych',
            'Nie udało się pobrać listy punktów nadawczych z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }
}
