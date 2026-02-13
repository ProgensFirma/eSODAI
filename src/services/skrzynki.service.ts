import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Skrzynka } from '../models/skrzynka.model';
import { TSkrzynki } from '../models/enums.model';
import { ConfigService } from './config.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkrzynkiService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/skrzynki`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorService: ErrorNotificationService
  ) {}

  getSkrzynki(): Observable<Skrzynka[]> {

    const params = {
      sesja: '123',
    };

    return this.http.get<Skrzynka[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching skrzynki:', error);

        if (!environment.production) {
          return of(this.getMockData());
        } else {
          this.errorService.showError(
            'Błąd pobierania skrzynek',
            'Nie udało się pobrać listy skrzynek z serwera. Sprawdź połączenie z serwerem.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  private getMockData(): Skrzynka[] {
    return [
      {
        sql: '',
        sqlOrder: '',
        skrzynka: TSkrzynki.tss_Sprawy,
        poziom: 1,
        typ: 'ts_brak',
        nazwa: 'Sprawy',
        zliczana: false,
        ilosc: 0,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: TSkrzynki.tss_SSprTermin,
        poziom: 2,
        typ: 'ts_sprawy',
        nazwa: 'Przeterminowane',
        zliczana: true,
        ilosc: 3,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: TSkrzynki.tss_SSprPilne,
        poziom: 2,
        typ: 'ts_sprawy',
        nazwa: 'Pilne',
        zliczana: true,
        ilosc: 5,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: TSkrzynki.tss_SOtrzymane,
        poziom: 2,
        typ: 'ts_sprawy',
        nazwa: 'Otrzymane',
        zliczana: true,
        ilosc: 12,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: '',
        skrzynka: TSkrzynki.tes_korespEle,
        poziom: 1,
        typ: 'ts_brak',
        nazwa: 'Korespondencja elektroniczna',
        zliczana: false,
        ilosc: 0,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by kore.DATAKOR desc',
        skrzynka: TSkrzynki.tes_KEleEMail,
        poziom: 2,
        typ: 'ts_korespEl',
        nazwa: 'e-mail',
        zliczana: true,
        ilosc: 8,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: true,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by kore.DATAKOR desc',
        skrzynka: TSkrzynki.tes_KEleDoreczPrzych,
        poziom: 2,
        typ: 'ts_korespEl',
        nazwa: 'eDoreczenia przychodzące',
        zliczana: true,
        ilosc: 3,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: true,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by kore.DATAKOR desc',
        skrzynka: TSkrzynki.tes_KEleDoreczDoWys,
        poziom: 2,
        typ: 'ts_korespEl',
        nazwa: 'eDoreczenia do wysłania',
        zliczana: true,
        ilosc: 2,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: true,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by kore.DATAKOR desc',
        skrzynka: TSkrzynki.tes_KEleDoreczWyslana,
        poziom: 2,
        typ: 'ts_korespEl',
        nazwa: 'eDoreczenia wysłane',
        zliczana: true,
        ilosc: 2,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: true,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: '',
        skrzynka: TSkrzynki.tps_Pisma,
        poziom: 1,
        typ: 'ts_brak',
        nazwa: 'Dokumenty',
        zliczana: false,
        ilosc: 0,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by dok.NUMER desc',
        skrzynka: TSkrzynki.tps_PBiezace,
        poziom: 2,
        typ: 'ts_pisma',
        nazwa: 'Bieżące',
        zliczana: true,
        ilosc: 8,
        suma: 0,
        zmiana: false,
        doWgl: false,
        doUsun: false,
        korEl: false,
        skrDef: 39,
        dokFinPoziom: 0,
        dokFinZmiana: false
      },
      {
        sql: '',
        sqlOrder: 'order by dok.NUMER desc',
        skrzynka: TSkrzynki.tps_PDoWgladu,
        poziom: 2,
        typ: 'ts_pisma',
        nazwa: 'Do wglądu',
        zliczana: true,
        ilosc: 4,
        suma: 0,
        zmiana: false,
        doWgl: true,
        doUsun: true,
        korEl: false,
        skrDef: -77,
        dokFinPoziom: 0,
        dokFinZmiana: false
      }
    ];
  }
}