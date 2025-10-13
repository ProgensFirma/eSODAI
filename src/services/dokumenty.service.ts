import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Dokument } from '../models/dokument.model';

@Injectable({
  providedIn: 'root'
})
export class DokumentyService {
  private apiUrl = 'http://localhost:8448/skrzynki/dokumenty';

  constructor(private http: HttpClient) {}

  getDokumenty(skrzynka: number, zalInfo: boolean = true): Observable<Dokument[]> {
    const params = {
      skrzynka: skrzynka.toString(),
      zalInfo: zalInfo.toString()
    };

    return this.http.get<Dokument[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching dokumenty:', error);
        // Return mock data for development
        return of(this.getMockData());
      })
    );
  }

  private getMockData(): Dokument[] {
    return [
      {
        "numer": 2799963,
        "archiwum": false,
        "dokGlowny": 2799963,
        "wersja": "0",
        "aktualny": true,
        "statusEdycji": "se_Zmieniany",
        "doWgladu": false,
        "typ": {
          "nazwa": "E-PUAP",
          "finansowy": false
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
        "kanalWe": "tk_brak",
        "domKanalWy": "tk_brak",
        "kontrahent": {
          "numer": 2654837,
          "identyfikator": "POWIAT MIELECKI",
          "firma": true,
          "nIP": ""
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
        "statusPrzek": "sp_przyj",
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
        "oper": "tboSelect",
        "status": "sOK",
        "statusDane": ""
      },
      {
        "numer": 2806367,
        "archiwum": false,
        "dokGlowny": 2806367,
        "wersja": "0",
        "aktualny": true,
        "statusEdycji": "se_Zmieniany",
        "doWgladu": false,
        "typ": {
          "nazwa": "DECYZJA",
          "finansowy": false
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
        "kanalWe": "tk_brak",
        "domKanalWy": "tk_brak",
        "kontrahent": {
          "numer": 1371332,
          "identyfikator": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE",
          "firma": true,
          "nIP": ""
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
        "statusPrzek": "sp_przyj",
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
        "oper": "tboSelect",
        "status": "sOK",
        "statusDane": ""
      },
      {
        "numer": 2827761,
        "archiwum": false,
        "dokGlowny": 2827761,
        "wersja": "0",
        "aktualny": true,
        "statusEdycji": "se_Zmieniany",
        "doWgladu": false,
        "typ": {
          "nazwa": "FAKTURA",
          "finansowy": true
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
        "kanalWe": "tk_brak",
        "domKanalWy": "tk_brak",
        "kontrahent": {
          "numer": 299336,
          "identyfikator": "\"APKON\" SP. Z O.O.",
          "firma": false,
          "nIP": ""
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
        "statusPrzek": "sp_przyj",
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
        "oper": "tboSelect",
        "status": "sOK",
        "statusDane": ""
      }
    ];
  }
}