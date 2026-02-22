import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { TOsobaInfo } from '../models/typy-info.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PracownicyService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/pracownicy`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getPracownicy(jednostka: string): Observable<TOsobaInfo[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('jednostka', jednostka);

    return this.http.get<TOsobaInfo[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching pracownicy:', error);

        if (!environment.production) {
          return of(this.getMockPracownicy());
        } else {
          this.errorService.showError(
            'Błąd pobierania pracowników',
            'Nie udało się pobrać listy pracowników z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  getMockPracownicy(): TOsobaInfo[] {
    return [
      {
        numer: 1,
        identyfikator: 'Jan Kowalski'
      },
      {
        numer: 2,
        identyfikator: 'Anna Nowak'
      },
      {
        numer: 3,
        identyfikator: 'Piotr Wiśniewski'
      },
      {
        numer: 4,
        identyfikator: 'Maria Wójcik'
      },
      {
        numer: 5,
        identyfikator: 'Krzysztof Kowalczyk'
      },
      {
        numer: 6,
        identyfikator: 'Magdalena Kamińska'
      },
      {
        numer: 7,
        identyfikator: 'Andrzej Lewandowski'
      },
      {
        numer: 8,
        identyfikator: 'Agnieszka Zielińska'
      },
      {
        numer: 9,
        identyfikator: 'Tomasz Szymański'
      },
      {
        numer: 10,
        identyfikator: 'Katarzyna Woźniak'
      },
      {
        numer: 11,
        identyfikator: 'Paweł Dąbrowski'
      },
      {
        numer: 12,
        identyfikator: 'Ewa Kozłowska'
      }
    ];
  }
}
