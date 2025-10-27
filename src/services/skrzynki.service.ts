import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Skrzynka } from '../models/skrzynka.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkrzynkiService {
  private apiUrl = `${environment.apiBaseUrl}/skrzynki`;

  constructor(private http: HttpClient) {}

  getSkrzynki(): Observable<Skrzynka[]> {
    return this.http.get<Skrzynka[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching skrzynki:', error);
        // Return mock data for development
        return of(this.getMockData());
      })
    );
  }

  private getMockData(): Skrzynka[] {
    return [
      {
        sql: '',
        sqlOrder: '',
        skrzynka: 'tss_Sprawy',
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
        dokFinZmiana: false,
        numer: 0
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: 'tss_SSprTermin',
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
        dokFinZmiana: false,
        numer: 1
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: 'tss_SSprPilne',
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
        dokFinZmiana: false,
        numer: 2
      },
      {
        sql: '',
        sqlOrder: 'order by spr.NUMER desc',
        skrzynka: 'tss_SOtrzymane',
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
        dokFinZmiana: false,
        numer: 3
      },
      {
        sql: '',
        sqlOrder: '',
        skrzynka: 'tes_korespEle',
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
        dokFinZmiana: false,
        numer: 25
      },
      {
        sql: '',
        sqlOrder: 'order by kore.DATAKOR desc',
        skrzynka: 'tes_KEleEMail',
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
        dokFinZmiana: false,
        numer: 26
      },
      {
        sql: '',
        sqlOrder: '',
        skrzynka: 'tps_Pisma',
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
        dokFinZmiana: false,
        numer: 33
      },
      {
        sql: '',
        sqlOrder: 'order by dok.NUMER desc',
        skrzynka: 'tps_PDoWgladu',
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
        dokFinZmiana: false,
        numer: 35
      }
    ];
  }
}