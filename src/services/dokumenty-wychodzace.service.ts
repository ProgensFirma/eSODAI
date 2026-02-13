import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DokumentWychodzacy } from '../models/dokument-wychodzacy.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus, TStatWysylki } from '../models/enums.model';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DokumentyWychodzaceService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorService: ErrorNotificationService
  ) {}

  getDokumentyWychodzace(
    sesja: number,
    zDW: boolean,
    rejestr?: string,
    rejestrRok?: number
  ): Observable<DokumentWychodzacy[]> {
    let params = new HttpParams()
      .set('sesja', sesja.toString())
      .set('zDW', zDW.toString());

    if (rejestr) {
      params = params.set('rejestr', rejestr);
    }

    if (rejestrRok) {
      params = params.set('RejestrRok', rejestrRok.toString());
    }

    return this.http.get<DokumentWychodzacy[]>(`${this.configService.apiBaseUrl}/dokWyjscia`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching dokumenty wychodzace:', error);

          if (!environment.production) {
            return of(this.getMockData());
          } else {
            this.errorService.showError(
              'Błąd pobierania dokumentów wychodzących',
              'Nie udało się pobrać listy dokumentów wychodzących z serwera.'
            );
            return throwError(() => error);
          }
        })
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
        rejestrRok: 2025,
        rejestrNrPozycji: "3/RPSW/24",
        typ: "",
        dataWyjscia: "2025-11-13T00:00:00.000Z",
        godzWyjscia: 0.0,
        kontrahent: {
          numer: 299336,
          identyfikator: "\"APKON\" SP. Z O.O.",
          firma: false,
          nip: "",
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
        statusWysylki: TStatWysylki.tw_wyslano,
        kanalWysylki: "tk_brak",
        wysylkaEpuap: null,
        wysylkaeDorecz: 2827815,
        doWiadomosci: [
          {
            numer: 2827820,
            kontrahent: {
              numer: 1091601,
              identyfikator: "\"ALTA\" PPHU. OSTROWSKA A.",
              firma: true,
              nip: "",
              adres: " 37-700  ŻOŁNIERZY I ARMII WP 1/44  "
            },
            osoba: null,
            wysylkaEpuap: null,
            wysylkaeDorecz: null,
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
              nip: "",
              adres: " 02-436 WARSZAWA GLOBUSOWA 38  "
            },
            osoba: null,
            wysylkaEpuap: null,
            wysylkaeDorecz: null,
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
              nip: "",
              adres: " 37-700  ŻOŁNIERZY I ARMII WP 1/44  "
            },
            osoba: {
              numer: 2827822,
              identyfikator: "QWERTY JAN"
            },
            wysylkaEpuap: null,
            wysylkaeDorecz: null,
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
          nip: "8171865969",
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
        statusWysylki: TStatWysylki.tw_wyslano,
        kanalWysylki: "tk_brak",
        wysylkaEpuap: null,
        wysylkaeDorecz: null,
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
          nip: "",
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
        statusWysylki: TStatWysylki.tw_wyslano,
        kanalWysylki: "tk_brak",
        wysylkaEpuap: null,
        wysylkaeDorecz: null,
        doWiadomosci: [],

        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      },
      {
        numer: 2827950,
        dokument: {
          numer: 2827900,
          typ: {
            nazwa: "NOTA",
            finansowy: true,
            polecenieZaplaty: false
          },
          nazwa: "Nota obciążeniowa",
          rejestrNrPozycji: "183/R-DJWI-CD/24",
          kontrahent: null
        },
        rejestr: "RPW",
        rejestrNumer: 5686,
        rejestrRok: 2024,
        rejestrNrPozycji: "5686/RPW/24",
        typ: "",
        dataWyjscia: "2024-12-17T00:00:00.000Z",
        godzWyjscia: 0.625,
        kontrahent: {
          numer: 2770462,
          identyfikator: "SZPOJNAROWICZ JÓZEFA",
          firma: false,
          nip: "",
          adres: " 38-604 LESKO HOCZEW 49 "
        },
        wprowadzil: {
          numer: 861490,
          identyfikator: "KONIECZNA TERESA"
        },
        wprowadzilData: "2024-12-17T15:00:12.345Z",
        wyslal: {
          numer: 861490,
          identyfikator: "KONIECZNA TERESA"
        },
        statusWysylki: TStatWysylki.tw_wyslano,
        kanalWysylki: "tk_poczta",
        wysylkaEpuap: null,
        wysylkaeDorecz: null,
        doWiadomosci: [],

        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      },
      {
        numer: 2828000,
        dokument: {
          numer: 2827850,
          typ: {
            nazwa: "PISMO",
            finansowy: false,
            polecenieZaplaty: false
          },
          nazwa: "Pismo ogólne",
          rejestrNrPozycji: "112/R-DTWI-JBL/24",
          kontrahent: null
        },
        rejestr: "RPW",
        rejestrNumer: 5687,
        rejestrRok: 2024,
        rejestrNrPozycji: "5687/RPW/24",
        typ: "",
        dataWyjscia: "2024-12-18T00:00:00.000Z",
        godzWyjscia: 0.458333333333333,
        kontrahent: {
          numer: 284879,
          identyfikator: "WIOŚ W GDAŃSKU",
          firma: true,
          nip: "5842738392",
          adres: " 80-387 GDAŃSK NORWIDA CYPRIANA KAMILA 4 "
        },
        wprowadzil: {
          numer: 1059948,
          identyfikator: "KUŚ DOROTA"
        },
        wprowadzilData: "2024-12-18T11:00:45.678Z",
        wyslal: {
          numer: 1059948,
          identyfikator: "KUŚ DOROTA"
        },
        statusWysylki: TStatWysylki.tw_wyslano,
        kanalWysylki: "tk_epuap",
        wysylkaEpuap: 2828001,
        wysylkaeDorecz: null,
        doWiadomosci: [],

        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      },
      {
        numer: 2828050,
        dokument: {
          numer: 2827800,
          typ: {
            nazwa: "WNIOSEK",
            finansowy: false,
            polecenieZaplaty: false
          },
          nazwa: "Wniosek o wydanie zaświadczenia",
          rejestrNrPozycji: "10997/RPP/24",
          kontrahent: null
        },
        rejestr: "RPW",
        rejestrNumer: 5688,
        rejestrRok: 2024,
        rejestrNrPozycji: "5688/RPW/24",
        typ: "",
        dataWyjscia: "2024-12-18T00:00:00.000Z",
        godzWyjscia: 0.541666666666667,
        kontrahent: {
          numer: 2679291,
          identyfikator: "ALDESA CONSTRUCCIONES POLSKA",
          firma: true,
          nip: "1234567890",
          adres: " 38-422 ISKRZYNIA PODKARPACKA 99A "
        },
        wprowadzil: {
          numer: 861528,
          identyfikator: "BLICHARZ JOANNA"
        },
        wprowadzilData: "2024-12-18T13:00:23.789Z",
        wyslal: {
          numer: 861528,
          identyfikator: "BLICHARZ JOANNA"
        },
        statusWysylki: TStatWysylki.tw_niewyslano,
        kanalWysylki: "tk_eDorecz",
        wysylkaEpuap: null,
        wysylkaeDorecz: 2828051,
        doWiadomosci: [],

        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ""
      }
    ];
  }
}
