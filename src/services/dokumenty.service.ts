import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Dokument } from '../models/dokument.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TBazaOper, TeSodStatus, TStatusEdycji, TKanalTyp, TStatusPrzek } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class DokumentyService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/skrzynki/dokumenty`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }  

  getDokumenty(skrzynka: string, zalInfo: boolean = true): Observable<Dokument[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('skrzynka', skrzynka)
      .append('zalInfo', zalInfo.toString());

    return this.http.get<Dokument[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching dokumenty:', error);
        return of(this.getMockData());
      })
    );
  }

  getDokument(numer: number): Observable<Dokument> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('numer', numer.toString())
      .append('zalInfo', 'true');

    return this.http.get<Dokument>(`${this.configService.apiBaseUrl}/dokumenty/dokument`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching dokument:', error);
        const mockData = this.getMockData();
        const dokument = mockData.find(d => d.numer === numer);
        return of(dokument || mockData[0]);
      })
    );
  }
    
  getOsobaRejestr(): Observable<{ Rejestr: string }> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.get<{ Rejestr: string }>(`${this.configService.apiBaseUrl}/dokumenty/osoba/rejestr`,
      {headers: this.getHeaders(), params: params}).pipe(
      catchError(error => {
        console.error('Error fetching osoba rejestr:', error);
        return of({ Rejestr: 'RPP' });
      })
    );
  }

  private getMockData(): Dokument[] {
    return [
      {
        "numer": 2799963,
        "archiwum": false,
        "dokGlowny": 2799963,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_Zmieniany,
        "doWgladu": false,
        "typ": {
          "nazwa": "E-PUAP",
          "finansowy": false,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "Postanowienie o zawieszeniu postępowania.xml",
        "opis": "Postanowienie o zawieszeniu postępowania",
        "sprawa": null,
        "rejestr": "RPP",
        "rejestrNumer": 10496,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "10496/RPP/24",
        "dataWplywu": "2024-10-11T00:00:00.000Z",
        "godzinaWplywu": 0.411805555555556,
        "numerNaDok": "OŚ.6233.10.2024.AP",
        "dataNaDok": "2024-10-11T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_brak,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 2654837,
          "identyfikator": "POWIAT MIELECKI",
          "firma": true,
          "nip": "",
          "adres": null
        },
        "przekazujacy": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E3",
          "nazwa": "WIELOOSOBOWE SAMODZIELNE STANOWISKA PRACY D/S ADMINISRACYJNO - TECHNICZNYCH (TARNOBRZEG)",
          "kod": ""
        },
        "dataPrzekazania": "2024-10-11T00:00:00.000Z",
        "prowadzacy": {
          "numer": 861528,
          "identyfikator": "KUŚ DOROTA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 0,
          "identyfikator": ""
        },
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_przyj,
        "dataAlert": "2024-10-11T00:00:00.000Z",
        "dataPlan": "1899-12-30T00:00:00.000Z",
        "daneFinansowe": null,
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": false,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "",
        "zalaczniki": [],
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2806367,
        "archiwum": false,
        "dokGlowny": 2806367,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_Zmieniany,
        "doWgladu": false,
        "typ": {
          "nazwa": "DECYZJA",
          "finansowy": false,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "DECYZJA",
        "opis": "",
        "sprawa": null,
        "rejestr": "RPP",
        "rejestrNumer": 10940,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "10940/RPP/24",
        "dataWplywu": "2024-10-23T00:00:00.000Z",
        "godzinaWplywu": 0.630555555555556,
        "numerNaDok": "",
        "dataNaDok": "1899-12-30T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_brak,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 1371332,
          "identyfikator": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE",
          "firma": true,
          "nip": "",
          "adres": null
        },
        "przekazujacy": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E3",
          "nazwa": "WIELOOSOBOWE SAMODZIELNE STANOWISKA PRACY D/S ADMINISRACYJNO - TECHNICZNYCH (TARNOBRZEG)",
          "kod": ""
        },
        "dataPrzekazania": "2024-10-24T00:00:00.000Z",
        "prowadzacy": {
          "numer": 861528,
          "identyfikator": "KUŚ DOROTA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 0,
          "identyfikator": ""
        },
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_przyj,
        "dataAlert": "1899-12-30T00:00:00.000Z",
        "dataPlan": "1899-12-30T00:00:00.000Z",
        "daneFinansowe": null,
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": false,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "",
        "zalaczniki": [],
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2827761,
        "archiwum": false,
        "dokGlowny": 2827761,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_Zmieniany,
        "doWgladu": false,
        "typ": {
          "nazwa": "FAKTURA",
          "finansowy": true,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "FAKTURA1",
        "opis": "",
        "sprawa": null,
        "rejestr": "R-DTWI-JBL",
        "rejestrNumer": 111,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "111/R-DTWI-JBL/24",
        "dataWplywu": "2025-06-10T00:00:00.000Z",
        "godzinaWplywu": 0.463888888888889,
        "numerNaDok": "",
        "dataNaDok": "1899-12-30T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_brak,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 299336,
          "identyfikator": "\"APKON\" SP. Z O.O.",
          "firma": false,
          "nip": "",
          "adres": null
        },
        "przekazujacy": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": ""
        },
        "dataPrzekazania": "2025-06-10T00:00:00.000Z",
        "prowadzacy": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 0,
          "identyfikator": ""
        },
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_przyj,
        "dataAlert": "1899-12-30T00:00:00.000Z",
        "dataPlan": "1899-12-30T00:00:00.000Z",
        "daneFinansowe": {
          "poziom": 0,
          "dataWystawienia": "1899-12-30T00:00:00.000Z",
          "dataSprzedazy": "1899-12-30T00:00:00.000Z",
          "dataPlatnosci": "1899-12-30T00:00:00.000Z",
          "dataZaplaty": "1899-12-30T00:00:00.000Z",
          "dataVAT": "1899-12-30T00:00:00.000Z",
          "brutto": 123.0,
          "netto": 100.0,
          "vat": 23.0
        },
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": false,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "",
        "zalaczniki": [
          {
            "numer": 2827765,
            "plik": "a.pdf"
          }
        ],
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2827800,
        "archiwum": false,
        "dokGlowny": 2827800,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_Zmieniany,
        "doWgladu": false,
        "typ": {
          "nazwa": "WNIOSEK",
          "finansowy": false,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "Wniosek o wydanie zaświadczenia",
        "opis": "Wniosek dotyczący wydania zaświadczenia o samodzielności lokalu",
        "sprawa": null,
        "rejestr": "RPP",
        "rejestrNumer": 10997,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "10997/RPP/24",
        "dataWplywu": "2024-12-15T00:00:00.000Z",
        "godzinaWplywu": 0.385416666666667,
        "numerNaDok": "",
        "dataNaDok": "1899-12-30T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_brak,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 2679291,
          "identyfikator": "ALDESA CONSTRUCCIONES POLSKA",
          "firma": true,
          "nip": "1234567890",
          "adres": null
        },
        "przekazujacy": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E3",
          "nazwa": "WIELOOSOBOWE SAMODZIELNE STANOWISKA PRACY D/S ADMINISRACYJNO - TECHNICZNYCH (TARNOBRZEG)",
          "kod": ""
        },
        "dataPrzekazania": "2024-12-15T00:00:00.000Z",
        "prowadzacy": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E1",
          "nazwa": "DZIAŁ INSPEKCJI (TARNOBRZEG)",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 861528,
          "identyfikator": "BLICHARZ JOANNA"
        },
        "dataPrzyjecia": "2024-12-15T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_przyj,
        "dataAlert": "2024-12-22T00:00:00.000Z",
        "dataPlan": "2024-12-29T00:00:00.000Z",
        "daneFinansowe": null,
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": false,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "",
        "zalaczniki": [
          {
            "numer": 2827801,
            "plik": "wniosek.pdf"
          }
        ],

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2827850,
        "archiwum": false,
        "dokGlowny": 2827850,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_Zmieniany,
        "doWgladu": false,
        "typ": {
          "nazwa": "PISMO",
          "finansowy": false,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "Pismo ogólne",
        "opis": "",
        "sprawa": null,
        "rejestr": "R-DTWI-JBL",
        "rejestrNumer": 112,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "112/R-DTWI-JBL/24",
        "dataWplywu": "2024-12-16T00:00:00.000Z",
        "godzinaWplywu": 0.520833333333333,
        "numerNaDok": "WZ/123/2024",
        "dataNaDok": "2024-12-16T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_ePuap,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 284879,
          "identyfikator": "WIOŚ W GDAŃSKU",
          "firma": false,
          "nip": "",
          "adres": null
        },
        "przekazujacy": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E3",
          "nazwa": "WIELOOSOBOWE SAMODZIELNE STANOWISKA PRACY D/S ADMINISRACYJNO - TECHNICZNYCH (TARNOBRZEG)",
          "kod": ""
        },
        "dataPrzekazania": "2024-12-16T00:00:00.000Z",
        "prowadzacy": {
          "numer": 1059948,
          "identyfikator": "KUŚ DOROTA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E3",
          "nazwa": "WIELOOSOBOWE SAMODZIELNE STANOWISKA PRACY D/S ADMINISRACYJNO - TECHNICZNYCH (TARNOBRZEG)",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 0,
          "identyfikator": ""
        },
        "dataPrzyjecia": "1899-12-30T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_oczek,
        "dataAlert": "1899-12-30T00:00:00.000Z",
        "dataPlan": "1899-12-30T00:00:00.000Z",
        "daneFinansowe": null,
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": false,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "WZ/123/2024",
        "zalaczniki": [],

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2827900,
        "archiwum": false,
        "dokGlowny": 2827900,
        "wersja": 0,
        "aktualny": true,
        "statusEdycji": TStatusEdycji.se_DoZatw,
        "doWgladu": true,
        "typ": {
          "nazwa": "NOTA",
          "finansowy": true,
          "poleceniezaplaty": false
        },
        "szablon": null,
        "nazwa": "Nota obciążeniowa",
        "opis": "Nota za opłaty administracyjne",
        "sprawa": null,
        "rejestr": "R-DJWI-CD",
        "rejestrNumer": 183,
        "rejestrRok": 2024,
        "rejestrNrPozycji": "183/R-DJWI-CD/24",
        "dataWplywu": "2024-12-17T00:00:00.000Z",
        "godzinaWplywu": 0.395833333333333,
        "numerNaDok": "NO/456/2024",
        "dataNaDok": "2024-12-17T00:00:00.000Z",
        "kanalWe": TKanalTyp.tk_brak,
        "domKanalWy": TKanalTyp.tk_brak,
        "kontrahent": {
          "numer": 2770462,
          "identyfikator": "SZPOJNAROWICZ JÓZEFA",
          "firma": false,
          "nip": "",
          "adres": null
        },
        "przekazujacy": {
          "numer": 861490,
          "identyfikator": "KONIECZNA TERESA"
        },
        "przekazujacyWydzial": {
          "stanowisko": false,
          "symbol": "1E2",
          "nazwa": "DZIAŁ FINANSOWY",
          "kod": ""
        },
        "dataPrzekazania": "2024-12-17T00:00:00.000Z",
        "prowadzacy": {
          "numer": 861490,
          "identyfikator": "KONIECZNA TERESA"
        },
        "prowadzacyWydzial": {
          "stanowisko": false,
          "symbol": "1E2",
          "nazwa": "DZIAŁ FINANSOWY",
          "kod": ""
        },
        "odpowiedzialny": {
          "numer": 861490,
          "identyfikator": "KONIECZNA TERESA"
        },
        "dataPrzyjecia": "2024-12-17T00:00:00.000Z",
        "uprawPoziom": "",
        "statusPrzek": TStatusPrzek.sp_przyj,
        "dataAlert": "1899-12-30T00:00:00.000Z",
        "dataPlan": "1899-12-30T00:00:00.000Z",
        "daneFinansowe": {
          "poziom": 0,
          "dataWystawienia": "2024-12-17T00:00:00.000Z",
          "dataSprzedazy": "2024-12-17T00:00:00.000Z",
          "dataPlatnosci": "2025-01-16T00:00:00.000Z",
          "dataZaplaty": "1899-12-30T00:00:00.000Z",
          "dataVAT": "2024-12-17T00:00:00.000Z",
          "brutto": 450.0,
          "netto": 450.0,
          "vat": 0.0
        },
        "grupa1": "",
        "grupa2": "",
        "grupa3": "",
        "publiczny": true,
        "dokGuid": "",
        "jrwa": "",
        "obcyNumer": "NO/456/2024",
        "zalaczniki": [
          {
            "numer": 2827901,
            "plik": "nota_obciazeniowa.pdf"
          }
        ],

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      }
    ];
  }
}