import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DokumentWychodzacy } from '../models/dokument-wychodzacy.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class DokumentyWychodzaceService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getDokumentyWychodzace(
    sesja: number,
    rejestr?: string,
    rejestrRok?: number
  ): Observable<DokumentWychodzacy[]> {
    let params = new HttpParams().set('sesja', sesja.toString());

    if (rejestr) {
      params = params.set('rejestr', rejestr);
    }

    if (rejestrRok) {
      params = params.set('RejestrRok', rejestrRok.toString());
    }

    return this.http.get<DokumentWychodzacy[]>(`${this.configService.apiBaseUrl}/dokWyjscia`, { params })
      .pipe(
        catchError(() => of(this.getMockData()))
      );
  }

  private getMockData(): DokumentWychodzacy[] {
    return [
      {
        numer: 2827814,
        dokument: {
          numer: 2827812,
          typ: {
            nazwa: "ZGŁOSZENIE ZAKOŃCZENIA BUDOWY",
            finansowy: false,
            polecenieZaplaty: false
          },
          nazwa: "ZGŁOSZENIE ZAKOŃCZENIA BUDOWY",
          rejestrNrPozycji: "115/R-DTWI-JBL/24",
          kontrahent: null
        },
        rejestr: "RPSW",
        rejestrNumer: 3,
        rejestrRok: 2024,
        rejestrNrPozycji: "3/RPSW/24",
        typ: "",
        dataWyjscia: "2025-11-13T00:00:00.000Z",
        godzWyjscia: 0.0,
        kontrahent: {
          numer: 299336,
          identyfikator: "\"APKON\" SP. Z O.O.",
          firma: false,
          nIP: "",
          adres: " 37-700 PRZEMYŚL BOHATERÓW GETTA 63 "
        },
        wprowadzil: {
          numer: 861528,
          identyfikator: "BLICHARZ JOANNA"
        },
        wprowadzilData: "2025-11-13T11:37:59.788Z",
        wyslal: {
          numer: 861528,
          identyfikator: "BLICHARZ JOANNA"
        },
        statusWysylki: "tw_wyslamo",
        kanalWysylki: "tk_brak",
        wysylkaEpuap: 0,
        wysylkaeDorecz: 0,
        doWiadomosci: [
          {
            numer: 2827820,
            kontrahent: {
              numer: 1091601,
              identyfikator: "\"ALTA\" PPHU. OSTROWSKA A.",
              firma: true,
              nIP: "",
              adres: " 37-700  ŻOŁNIERZY I ARMII WP 1/44  "
            },
            osoba: null,
            wysylkaEpuap: 0,
            wysylkaeDorecz: 0,
            oper: TBazaOper.tboSelect,
            status: TeSodStatus.sBrak,
            statusDane: ""
          },
          {
            numer: 2827821,
            kontrahent: {
              numer: 509478,
              identyfikator: "\"DONSERV\" APARATURA LABORATORYJNA-SERWIS-DORACZTWO",
              firma: true,
              nIP: "",
              adres: " 02-436 WARSZAWA GLOBUSOWA 38  "
            },
            osoba: null,
            wysylkaEpuap: 0,
            wysylkaeDorecz: 0,
            oper: TBazaOper.tboSelect,
            status: TeSodStatus.sBrak,
            statusDane: ""
          },
          {
            numer: 2827823,
            kontrahent: {
              numer: 1091601,
              identyfikator: "\"ALTA\" PPHU. OSTROWSKA A.",
              firma: true,
              nIP: "",
              adres: " 37-700  ŻOŁNIERZY I ARMII WP 1/44  "
            },
            osoba: {
              numer: 2827822,
              identyfikator: "QWERTY JAN"
            },
            wysylkaEpuap: 0,
            wysylkaeDorecz: 0,
            oper: TBazaOper.tboSelect,
            status: TeSodStatus.sBrak,
            statusDane: ""
          }
        ],
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      },
      {
        numer: 2827679,
        dokument: null,
        rejestr: "RPW",
        rejestrNumer: 5685,
        rejestrRok: 2024,
        rejestrNrPozycji: "5685/RPW/24",
        typ: "",
        dataWyjscia: "2024-12-09T00:00:00.000Z",
        godzWyjscia: 0.539583333333333,
        kontrahent: {
          numer: 2244053,
          identyfikator: "MOSKITO SYLWESTER KOŁECZEK",
          firma: true,
          nIP: "8171865969",
          adres: " 39-300 MIELEC GŁOWACKIEGO 4 "
        },
        wprowadzil: {
          numer: 1059948,
          identyfikator: "KUŚ DOROTA"
        },
        wprowadzilData: "2024-12-09T12:56:53.686Z",
        wyslal: {
          numer: 1059948,
          identyfikator: "KUŚ DOROTA"
        },
        statusWysylki: "tw_wyslamo",
        kanalWysylki: "tk_brak",
        wysylkaEpuap: 0,
        wysylkaeDorecz: 0,
        doWiadomosci: [],
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      },
      {
        numer: 2827669,
        dokument: {
          numer: 2827552,
          typ: {
            nazwa: "POSTANOWIENIE",
            finansowy: false,
            polecenieZaplaty: false
          },
          nazwa: "POSTANOWIENIE",
          rejestrNrPozycji: "182/R-DJWI-CD/24",
          kontrahent: null
        },
        rejestr: "RPW",
        rejestrNumer: 5684,
        rejestrRok: 2024,
        rejestrNrPozycji: "5684/RPW/24",
        typ: "",
        dataWyjscia: "2024-12-09T00:00:00.000Z",
        godzWyjscia: 0.534027777777778,
        kontrahent: {
          numer: 228209,
          identyfikator: "PREZYDENT MIASTA KROSNA",
          firma: true,
          nIP: "",
          adres: " 38-400 KROSNO LWOWSKA 28A "
        },
        wprowadzil: {
          numer: 861490,
          identyfikator: "KONIECZNA TERESA"
        },
        wprowadzilData: "2024-12-09T12:48:44.040Z",
        wyslal: {
          numer: 861490,
          identyfikator: "KONIECZNA TERESA"
        },
        statusWysylki: "tw_wyslamo",
        kanalWysylki: "tk_brak",
        wysylkaEpuap: 0,
        wysylkaeDorecz: 0,
        doWiadomosci: [],
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      }
    ];
  }
}
