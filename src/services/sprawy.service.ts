import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Sprawa } from '../models/sprawa.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class SprawyService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/skrzynki/sprawy`;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getSprawy(skrzynka: number): Observable<Sprawa[]> {
    
    const params = {
      skrzynka: skrzynka.toString()
    };

    return this.http.get<Sprawa[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching sprawy:', error);
        return of(this.getMockData());
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
        "statusPrzek": "sp_przyj",
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
        "statusPrzek": "sp_przyj",
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
        "statusPrzek": "sp_przyj",
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
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      }
    ];
  }
}
