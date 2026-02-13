import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Uprawnienie } from '../models/uprawnienie.model';
import { TUprawPoziom } from '../models/enums.model';
import { ConfigService } from './config.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UprawnienieService {
  private useMockData = true;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorService: ErrorNotificationService
  ) {}

  getUprawnienia(): Observable<Uprawnienie[]> {
    if (this.useMockData) {
      return of(this.getMockUprawnienia());
    }

    return this.http.get<Uprawnienie[]>(`${this.configService.apiBaseUrl}/uprawnienia`).pipe(
      catchError(error => {
        console.error('Error fetching uprawnienia:', error);

        if (!environment.production) {
          return of(this.getMockUprawnienia());
        } else {
          this.errorService.showError(
            'Błąd pobierania uprawnień',
            'Nie udało się pobrać listy uprawnień z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  private getMockUprawnienia(): Uprawnienie[] {
    return [
      {
        uprawnienie: 'AZ_SPIS',
        opis: 'AZ - Obsługa spisów zdawczo-odbiorczych',
        poziom: TUprawPoziom.tup_zmiana
      },
      {
        uprawnienie: 'AZ_PRACOWNIK',
        opis: 'AZ - Pracownik archiwum zakładowego',
        poziom: TUprawPoziom.tup_zmiana
      },
      {
        uprawnienie: 'RAPORTY',
        opis: 'Drukowanie raportów',
        poziom: TUprawPoziom.tup_zmiana
      },
      {
        uprawnienie: 'EDORECZ_ODB',
        opis: 'eDoręczenia - odbieranie wiadomości eDoręczeń',
        poziom: TUprawPoziom.tup_zmiana
      },
      {
        uprawnienie: 'ADMIN',
        opis: 'Administrator systemu',
        poziom: TUprawPoziom.tup_odczyt
      },
      {
        uprawnienie: 'SPRAWY',
        opis: 'Zarządzanie sprawami',
        poziom: TUprawPoziom.tup_zmiana
      },
      {
        uprawnienie: 'DOKUMENTY',
        opis: 'Zarządzanie dokumentami',
        poziom: TUprawPoziom.tup_odczyt
      },
      {
        uprawnienie: 'KONTRAHENCI',
        opis: 'Zarządzanie kontrahentami',
        poziom: TUprawPoziom.tup_brak
      }
    ];
  }
}
