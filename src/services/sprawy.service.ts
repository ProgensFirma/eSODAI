import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Sprawa } from '../models/sprawa.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';
import { TBazaOper, TeSodStatus, TSprStatusPrzek } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class SprawyService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/skrzynki/sprawy`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getSprawy(skrzynka: string): Observable<Sprawa[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('skrzynka', skrzynka);

    return this.http.get<Sprawa[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching sprawy:', error);

        if (!environment.production) {
          return of(this.getMockData());
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  createSprawa(sprawa: Sprawa): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawy/sprawa`, sprawa, { params }).pipe(
      catchError(error => {
        console.error('Error creating sprawa:', error);
        return throwError(() => error);
      })
    );
  }

  przekazSprawa(sprawa: number, body: {
    doJednostki: string;
    doOsoby: number;
    doJednostkiNadzor: string;
    doOsobyNadzor: number;
    notatka: string;
  }): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .set('sesja', sesjaId.toString())
      .set('sprawa', sprawa.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawa/przekaz`, body, { params }).pipe(
      catchError(error => {
        console.error('Error przekaz sprawa:', error);
        return throwError(() => error);
      })
    );
  }

  przyjmijSprawa(sprawa: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawa/przyjmij`, { sprawa, odrzuc: false }, { params }).pipe(
      catchError(error => {
        console.error('Error przyjmij sprawa:', error);
        return throwError(() => error);
      })
    );
  }

  zakonczSprawa(body: {
    sprawa: number;
    data: string;
    pozytywnie: boolean;
  }): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawa/zakoncz`, body, { params }).pipe(
      catchError(error => {
        console.error('Error zakoncz sprawa:', error);
        return throwError(() => error);
      })
    );
  }

  dolaczDokumentDoEtapuSprawy(sprawaNumer: number, etapNumer: number, dokumentNumer: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawy/dokumenty`, {
      sprawa: sprawaNumer,
      etap: etapNumer,
      dokument: dokumentNumer
    }, { params }).pipe(
      catchError(error => {
        console.error('Error dolacz dokument do etapu sprawy:', error);
        if (!environment.production) {
          return of({});
        }
        return throwError(() => error);
      })
    );
  }

  dolaczDokumentDoSprawy(dokumentNumer: number, sprawaNumer: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.configService.apiBaseUrl}/sprawy/dokumenty`, { dokument: dokumentNumer, sprawa: sprawaNumer }, { params }).pipe(
      catchError(error => {
        console.error('Error dolacz dokument do sprawy:', error);
        if (!environment.production) {
          return of({});
        }
        return throwError(() => error);
      })
    );
  }

  private getMockData(): Sprawa[] {
    return [
      {
        "numer": 2797031,
        "nazwa": "WNIOSEK",
        "typ": {
          "nazwa": "WNIOSEK",
          "rWA": ""
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7021.451.2024.ASO",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7021",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-04T00:00:00.000Z",
        "dataStop": "1899-12-30T00:00:00.000Z",
        "terminPlan": "2024-11-03T00:00:00.000Z",
        "terminAlarm": "2024-10-27T00:00:00.000Z",
        "dataOtrzymania": "1899-12-30T00:00:00.000Z",
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 0,
          "identyfikator": ""
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 1875284,
          "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANI",
          "firma": true,
          "nip": "8670003134",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "uprawPoziom": "",
        "opis": "",

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2797045,
        "nazwa": "POZWOLENIE NA BUDOWĘ",
        "typ": {
          "nazwa": "POZWOLENIE",
          "rWA": "7021"
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7021.452.2024.JBL",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7021",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-05T00:00:00.000Z",
        "dataStop": "2024-11-15T00:00:00.000Z",
        "terminPlan": "2024-11-05T00:00:00.000Z",
        "terminAlarm": "2024-10-29T00:00:00.000Z",
        "dataOtrzymania": "2024-10-05T00:00:00.000Z",
        "dataPrzyjecia": "2024-10-05T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 2679291,
          "identyfikator": "ALDESA CONSTRUCCIONES POLSKA",
          "firma": true,
          "nip": "1234567890",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "uprawPoziom": "",
        "opis": "",

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2797060,
        "nazwa": "SKARGA",
        "typ": {
          "nazwa": "SKARGA",
          "rWA": "7022"
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7022.453.2024.ASO",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7022",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-06T00:00:00.000Z",
        "dataStop": "1899-12-30T00:00:00.000Z",
        "terminPlan": "2024-11-06T00:00:00.000Z",
        "terminAlarm": "2024-10-30T00:00:00.000Z",
        "dataOtrzymania": "2024-10-06T00:00:00.000Z",
        "dataPrzyjecia": "2024-10-06T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 2770462,
          "identyfikator": "SZPOJNAROWICZ JÓZEFA",
          "firma": false,
          "nip": "",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "uprawPoziom": "",
        "opis": "",

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2797075,
        "nazwa": "ODWOŁANIE",
        "typ": {
          "nazwa": "ODWOŁANIE",
          "rWA": "7021"
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7021.454.2024.JBL",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7021",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-07T00:00:00.000Z",
        "dataStop": "1899-12-30T00:00:00.000Z",
        "terminPlan": "2024-11-07T00:00:00.000Z",
        "terminAlarm": "2024-10-31T00:00:00.000Z",
        "dataOtrzymania": "1899-12-30T00:00:00.000Z",
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 0,
          "identyfikator": ""
        },
        "statusPrzek": TSprStatusPrzek.sps_oczek,
        "odrzucona": false,
        "kontrahent": {
          "numer": 1875284,
          "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANI",
          "firma": true,
          "nip": "8670003134",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "uprawPoziom": "",
        "opis": "",

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2797090,
        "nazwa": "ZEZWOLENIE",
        "typ": {
          "nazwa": "ZEZWOLENIE",
          "rWA": "7023"
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7023.456.2024.KD",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7023",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-08T00:00:00.000Z",
        "dataStop": "2024-10-25T00:00:00.000Z",
        "terminPlan": "2024-11-08T00:00:00.000Z",
        "terminAlarm": "2024-11-01T00:00:00.000Z",
        "dataOtrzymania": "2024-10-08T00:00:00.000Z",
        "dataPrzyjecia": "2024-10-08T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "2024-10-25T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 861490,
          "identyfikator": "KONIECZNA TERESA"
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 2654837,
          "identyfikator": "POWIAT MIELECKI",
          "firma": true,
          "nip": "",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861490,
          "identyfikator": "KONIECZNA TERESA"
        },
        "uprawPoziom": "",
        "opis": "",

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2799947,
        "nazwa": "INFORMACJA",
        "typ": {
          "nazwa": "INFORMACJA",
          "rWA": ""
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7021.455.2024.JBL",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7021",
        "znak_rok": 2024,
        "sprawaGlowna": 0,
        "etapOstatni": 0,
        "glowna": false,
        "dataStart": "2024-10-11T00:00:00.000Z",
        "dataStop": "1899-12-30T00:00:00.000Z",
        "terminPlan": "2024-11-08T00:00:00.000Z",
        "terminAlarm": "2024-11-01T00:00:00.000Z",
        "dataOtrzymania": "1899-12-30T00:00:00.000Z",
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 0,
          "identyfikator": ""
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 284879,
          "identyfikator": "WIOŚ W GDAŃSKU",
          "firma": false,
          "nip": "",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "uprawPoziom": "",
        "opis": "",
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2799948,
        "nazwa": "INFORMACJA",
        "typ": {
          "nazwa": "INFORMACJA",
          "rWA": ""
        },
        "znakDef": "ZNAK SPRAWY_11",
        "znakSprawy": "DTWI.7021.455.2024.JBL",
        "znak_wydzial": "DTWI",
        "znak_RWA": "7021",
        "znak_rok": 2024,
        "sprawaGlowna": 2799947,
        "etapOstatni": 0,
        "glowna": true,
        "dataStart": "2024-10-11T00:00:00.000Z",
        "dataStop": "1899-12-30T00:00:00.000Z",
        "terminPlan": "2024-11-08T00:00:00.000Z",
        "terminAlarm": "2024-11-01T00:00:00.000Z",
        "dataOtrzymania": "2024-10-11T00:00:00.000Z",
        "dataPrzyjecia": "2024-10-11T00:00:00.000Z",
        "dataPrzekazania": "1899-12-30T00:00:00.000Z",
        "dataOdebrania": "1899-12-30T00:00:00.000Z",
        "osobaPrzek": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "statusPrzek": TSprStatusPrzek.sps_przyj,
        "odrzucona": false,
        "kontrahent": {
          "numer": 284879,
          "identyfikator": "WIOŚ W GDAŃSKU",
          "firma": false,
          "nip": "",
          "adres": ""
        },
        "nadzorWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "nadzorOsoba": {
          "numer": 200200,
          "identyfikator": "ADAMSKI ANDRZEJ"
        },
        "wykWydzial": {
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": "",
          "stanowisko": false
        },
        "wykOsoba": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "uprawPoziom": "",
        "opis": "",
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      }
    ];
  }
}
