import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WykazAkt } from '../models/wykaz-akt.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WykazAktService {
  private useMockData = true;

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/wykazakt/pelny`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getWykazAkt(): Observable<WykazAkt[]> {
    if (this.useMockData) {
      return of(this.getMockWykazAkt());
    }

    const sesja = this.authService.getCurrentSession()?.sesja || 0;
    const params = new HttpParams()
      .append('sesja', sesja)
      .append('wykaz', '');

    return this.http.get<WykazAkt[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching wykaz akt:', error);

        if (!environment.production) {
          return of(this.getMockWykazAkt());
        } else {
          this.errorService.showError(
            'Błąd pobierania wykazu akt',
            'Nie udało się pobrać wykazu akt z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  private getMockWykazAkt(): WykazAkt[] {
    return [
      {
        symbol: '0',
        poziom: 1,
        nazwa: 'ZARZĄDZANIE GMINĄ I JEJ REPREZENTACJA',
        archM: '033',
        archI: '2',
        uwagi: '',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '00',
        poziom: 2,
        nazwa: 'Organy kolegialne i jednoosobowe gminy',
        archM: '',
        archI: '',
        uwagi: '',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '000',
        poziom: 3,
        nazwa: 'Rada gminy',
        archM: '',
        archI: '',
        uwagi: '',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0000',
        poziom: 4,
        nazwa: 'Organizacja pracy rady gminy',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'między innymi regulaminy',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0001',
        poziom: 4,
        nazwa: 'Planowanie i sprawozdawczość z prac rady gminy',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'w tym korespondencja',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0002',
        poziom: 4,
        nazwa: 'Sesje rady gminy',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'między innymi zawiadomienia, stenogramy, protokoły, materiały pod obrady, uchwały',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0003',
        poziom: 4,
        nazwa: 'Wnioski i interpelacje radnych',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'w tym rejestr i odpowiedzi',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0004',
        poziom: 4,
        nazwa: 'Przewodniczący rady gminy',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'między innymi korespondencja kierowana do i od przewodniczącego',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      },
      {
        symbol: '0005',
        poziom: 4,
        nazwa: 'Wnioski i postulaty mieszkańców i innych podmiotów do rady gminy oraz spotkania z mieszkańcami i innymi podmiotami',
        archM: 'A',
        archI: 'Bc',
        uwagi: 'w tym rejestr i odpowiedzi',
        tylkoEZD: false,
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      }
    ];
  }
}