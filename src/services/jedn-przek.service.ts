import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TJednPrzek } from '../models/jedn-przek.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JednPrzekService {
  private useMockData = true;

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/jednPrzek`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getJednPrzek(): Observable<TJednPrzek[]> {
    if (this.useMockData) {
      return of(this.getMockJednPrzek());
    }

    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().append('sesja', sesjaId.toString());

    return this.http.get<TJednPrzek[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching jednPrzek:', error);

        if (!environment.production) {
          return of(this.getMockJednPrzek());
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private getMockJednPrzek(): TJednPrzek[] {
    return [
      {
        symbol: 'UM',
        nazwa: 'UM Mielec',
        eDoreczAdres: 'brak',
        glowna: true,
        wlasna: true,
        nSSOD: true,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: 'SP1',
        nazwa: 'Szkoła Podstawowa nr 1',
        eDoreczAdres: 'brak',
        glowna: false,
        wlasna: false,
        nSSOD: true,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: 'SP3',
        nazwa: 'Szkoła Podstawowa nr 3',
        eDoreczAdres: 'brak',
        glowna: false,
        wlasna: false,
        nSSOD: true,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: 'ZSP',
        nazwa: 'Zespół Szkół Ponadpodstawowych',
        eDoreczAdres: 'brak',
        glowna: false,
        wlasna: false,
        nSSOD: true,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: 'URZAD',
        nazwa: 'Urząd Skarbowy Mielec',
        eDoreczAdres: 'brak',
        glowna: false,
        wlasna: false,
        nSSOD: true,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      }
    ];
  }
}
