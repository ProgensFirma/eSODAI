import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Dokument } from '../models/dokument.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus, TStatusEdycji, TKanalTyp, TStatusPrzek } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class DokumentyService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/skrzynki/dokumenty`;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }  

  getDokumenty(skrzynka: number, zalInfo: boolean = true): Observable<Dokument[]> {
    
  const params = new HttpParams()
    .append('sesja', 123)
    .append('skrzynka', skrzynka.toString())
    .append('zalInfo', zalInfo.toString());   

    return this.http.get<Dokument[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching dokumenty:', error);
        // Return mock data for development
        return of(this.getMockData());
      })
    );
  }
    
  getOsobaRejestr(): Observable<{ Rejestr: string }> {
    
    const params = new HttpParams()
      .append('sesja', 123);  

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
          "vAT": 23.0
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
      }
    ];
  }
}