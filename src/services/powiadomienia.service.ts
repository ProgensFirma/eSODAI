import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { TPowiadomienie } from '../models/powiadomienie.model';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PowiadomieniaService {
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/powiadomienia`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorService: ErrorNotificationService
  ) {}

  getPowiadomienia(sesja: string, rekStart: number, rekIlosc: number): Observable<HttpResponse<TPowiadomienie[]>> {
    const params = new HttpParams()
      .set('sesja', sesja)
      .set('rekStart', rekStart.toString())
      .set('rekIlosc', rekIlosc.toString());

    return this.http.get<TPowiadomienie[]>(
      this.apiUrl,
      { params, observe: 'response' }
    ).pipe(
      catchError(error => {
        console.error('Error fetching powiadomienia:', error);

        if (!environment.production) {
          const headers = new HttpHeaders().set('qIlosc', '5');
          const mockResponse = new HttpResponse({
            body: this.getMockPowiadomienia(),
            headers: headers,
            status: 200
          });
          return of(mockResponse);
        } else {
          this.errorService.showError(
            'Błąd pobierania powiadomień',
            'Nie udało się pobrać listy powiadomień z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  // Mock data dla testów
  getMockPowiadomienia(): TPowiadomienie[] {
    return [
      {
        numer: 2214361,
        autor: {
          numer: 1559304,
          identyfikator: "KORCZ FILIP"
        },
        kontrahent: {
          numer: 2214328,
          identyfikator: "Imię Nazwisko",
          firma: false,
          nIP: "",
          adres: ""
        },
        data: "2026-01-23T13:38:43.537Z",
        dataWazn: "2026-02-22T00:00:00.000Z",
        naglowek: "Treść",
        opis: "Opis",
        pobrano: true,
        pobranoData: "2026-01-23T14:00:07.737Z",
        potwierdzono: false,
        potwierdzonoData: "1899-12-30T00:00:00.000Z",
        sprawa: {
          numer: 2214335,
          znakSprawy: "F.6727.1.2026",
          nazwa: "WYPISY WYRYS Z MPZP",
          glowna: false
        },
        dokument: {
          numer: 2214339,
          typ: null,
          nazwa: "Informacja o opłacie",
          rejestrNrPozycji: "10/R-FK/26",
          kontrahent: null
        },
        email: "ruminskihubert@gmail.com",
        telefon: "",
        sUProg: 3,
        sUProgIdDow: "",
        sUTypWew: 0,
        sUIdent: "",
        oper: "tboSelect",
        status: "sBrak",
        statusDane: ""
      },
      {
        numer: 2214343,
        autor: {
          numer: 1559304,
          identyfikator: "KORCZ FILIP"
        },
        kontrahent: {
          numer: 2214328,
          identyfikator: "Imię Nazwisko",
          firma: false,
          nIP: "",
          adres: ""
        },
        data: "2026-01-22T15:04:13.537Z",
        dataWazn: "2026-02-21T00:00:00.000Z",
        naglowek: "Test powiadmienia z SOD",
        opis: "Dokument zapłaty",
        pobrano: true,
        pobranoData: "2026-01-22T16:00:10.073Z",
        potwierdzono: false,
        potwierdzonoData: "1899-12-30T00:00:00.000Z",
        sprawa: {
          numer: 2214335,
          znakSprawy: "F.6727.1.2026",
          nazwa: "WYPISY WYRYS Z MPZP",
          glowna: false
        },
        dokument: {
          numer: 2214339,
          typ: null,
          nazwa: "Informacja o opłacie",
          rejestrNrPozycji: "10/R-FK/26",
          kontrahent: null
        },
        email: "ruminskihubert@gmail.com",
        telefon: "",
        sUProg: 3,
        sUProgIdDow: "",
        sUTypWew: 0,
        sUIdent: "",
        oper: "tboSelect",
        status: "sBrak",
        statusDane: ""
      },
      {
        numer: 2211807,
        autor: {
          numer: 0,
          identyfikator: "ADM"
        },
        kontrahent: {
          numer: 1587480,
          identyfikator: "BUDZIK MACIEJ",
          firma: false,
          nIP: "",
          adres: ""
        },
        data: "2025-12-17T13:33:43.477Z",
        dataWazn: "2025-12-24T00:00:00.000Z",
        naglowek: "Dotyczy kartoteki: 01/12/B - Osoby fizyczne: podatki lokalne",
        opis: "Przypominamy o upływającym terminie płatności raty.",
        pobrano: true,
        pobranoData: "2025-12-17T14:00:08.283Z",
        potwierdzono: true,
        potwierdzonoData: "2025-12-17T15:00:05.550Z",
        sprawa: null,
        dokument: null,
        email: "MACIEK02@ORANGE.PL",
        telefon: "604174733",
        sUProg: 9,
        sUProgIdDow: "1587481",
        sUTypWew: 1,
        sUIdent: "",
        oper: "tboSelect",
        status: "sBrak",
        statusDane: ""
      },
      {
        numer: 2214362,
        autor: {
          numer: 1559305,
          identyfikator: "NOWAK JAN"
        },
        kontrahent: {
          numer: 2214329,
          identyfikator: "Kowalski Adam",
          firma: false,
          nIP: "",
          adres: "ul. Główna 1, 00-001 Warszawa"
        },
        data: "2026-01-25T10:15:00.000Z",
        dataWazn: "2026-02-25T00:00:00.000Z",
        naglowek: "Zaproszenie na spotkanie",
        opis: "Prosimy o przybycie na spotkanie w sprawie planu zagospodarowania.",
        pobrano: false,
        pobranoData: "1899-12-30T00:00:00.000Z",
        potwierdzono: false,
        potwierdzonoData: "1899-12-30T00:00:00.000Z",
        sprawa: {
          numer: 2214340,
          znakSprawy: "U.6500.2.2026",
          nazwa: "Plan zagospodarowania działki nr 123",
          glowna: true
        },
        dokument: {
          numer: 2214350,
          typ: null,
          nazwa: "Zaproszenie",
          rejestrNrPozycji: "15/Z/26",
          kontrahent: null
        },
        email: "adam.kowalski@example.com",
        telefon: "501234567",
        sUProg: 3,
        sUProgIdDow: "",
        sUTypWew: 0,
        sUIdent: "",
        oper: "tboSelect",
        status: "sBrak",
        statusDane: ""
      },
      {
        numer: 2214363,
        autor: {
          numer: 1559306,
          identyfikator: "WIŚNIEWSKA ANNA"
        },
        kontrahent: {
          numer: 2214330,
          identyfikator: "Lewandowski Piotr",
          firma: false,
          nIP: "",
          adres: "ul. Polna 5, 30-001 Kraków"
        },
        data: "2026-01-26T08:30:00.000Z",
        dataWazn: "2026-03-01T00:00:00.000Z",
        naglowek: "Wezwanie do uzupełnienia dokumentacji",
        opis: "Należy uzupełnić brakujące dokumenty w ciągu 30 dni.",
        pobrano: false,
        pobranoData: "1899-12-30T00:00:00.000Z",
        potwierdzono: false,
        potwierdzonoData: "1899-12-30T00:00:00.000Z",
        sprawa: null,
        dokument: null,
        email: "p.lewandowski@email.pl",
        telefon: "602345678",
        sUProg: 2,
        sUProgIdDow: "",
        sUTypWew: 0,
        sUIdent: "",
        oper: "tboSelect",
        status: "sBrak",
        statusDane: ""
      }
    ];
  }
}
