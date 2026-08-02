import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { EdoreczPunktNadawczy } from '../models/edorecz-punkt-nadawczy.model';
import { TeDorTytTresc, EDoreczWyslana } from '../models/edorecz.model';
import { Dokument } from '../models/dokument.model';
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
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<EdoreczPunktNadawczy[]>(`${apiUrl}/eDorecz/PunktyNadawcze`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching punkty nadawcze:', error);

        if (!environment.production) {
          return of(this.mockPunktyNadawcze);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  getTytulTresc(dokument: number, mj: boolean): Observable<TeDorTytTresc> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('dokument', dokument.toString())
      .append('mj', mj.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<TeDorTytTresc>(`${apiUrl}/eDorecz/tytulTresc`, { params });
  }

  getDokument(numer: number): Observable<Dokument> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('numer', numer.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<Dokument>(`${apiUrl}/dokumenty`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching dokument:', error);
        return throwError(() => error);
      })
    );
  }

  wyslijKoperte(koperta: EDoreczWyslana): Observable<EDoreczWyslana> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.post<EDoreczWyslana>(`${apiUrl}/eDorecz/Koperta`, koperta, { params });
  }
}
