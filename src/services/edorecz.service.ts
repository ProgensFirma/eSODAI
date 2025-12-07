import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EDoreczDokument } from '../models/edorecz.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EDoreczService {
  private mockData: EDoreczDokument[] = [
    {
      "numer": 2210479,
      "idObce": "PPSA-E-de579ba3-ab8d-4056-ae38-de774fe00c9b",
      "data": "2025-11-28T11:10:35.427Z",
      "nazwa": "test",
      "adresatSkrzynka": "AE:PL-98699-88653-IIVRF-38",
      "adresat": {
        "numer": 1541968,
        "identyfikator": "GMINA SOFTRES - KLIENT WEWNĘTRZNY",
        "firma": true,
        "nIP": "8131515513",
        "adres": " 35-526 RZESZÓW ZACISZNA 44 "
      },
      "nadawcaSkrzynka": "AE:PL-92381-99395-GSGHS-29",
      "nadawca": {
        "numer": 2145957,
        "identyfikator": "MEDEKSA AGUNG",
        "firma": false,
        "nIP": "",
        "adres": " 35-048 RZESZÓW KONOPNICKIEJ 12 "
      },
      "tresc": "test",
      "pobrany": false,
      "pobranyData": "2025-12-07T00:52:54.913Z",
      "notatka": "",
      "zalaczniki": [],
      "potwierdzenia": [
        {
          "id": "707ac833-778a-4737-a683-287df7ea6364",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T11:10:35.418Z"
        },
        {
          "id": "8a740ec5-ea41-4da4-b999-d71f73e9e6f1",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T11:10:35.418Z"
        },
        {
          "id": "c68fbe63-0dfc-431b-9f36-efad7a271593",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T11:10:35.418Z"
        },
        {
          "id": "f3109979-167a-40c4-bd23-9c24d3feb87a",
          "typ": "nieznany",
          "info": "Przesyłka pomyślnie dostarczona do adresata, Message successfully handed over to the recipient",
          "data": "2025-11-28T11:12:45.986Z"
        }
      ],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    },
    {
      "numer": 2210477,
      "idObce": "PPSA-E-f1990125-bf37-4d71-adb0-ef0cfaec1602",
      "data": "2025-11-28T10:57:51.077Z",
      "nazwa": "test",
      "adresatSkrzynka": "AE:PL-98699-88653-IIVRF-38",
      "adresat": {
        "numer": 1541968,
        "identyfikator": "GMINA SOFTRES - KLIENT WEWNĘTRZNY",
        "firma": true,
        "nIP": "8131515513",
        "adres": " 35-526 RZESZÓW ZACISZNA 44 "
      },
      "nadawcaSkrzynka": "AE:PL-92381-99395-GSGHS-29",
      "nadawca": {
        "numer": 2145957,
        "identyfikator": "MEDEKSA AGUNG",
        "firma": false,
        "nIP": "",
        "adres": " 35-048 RZESZÓW KONOPNICKIEJ 12 "
      },
      "tresc": "test",
      "pobrany": false,
      "pobranyData": "2025-12-07T00:52:54.890Z",
      "notatka": "",
      "zalaczniki": [
        {
          "numer": 2210478,
          "plik": "test.txt"
        }
      ],
      "potwierdzenia": [
        {
          "id": "57f68001-84f0-4580-a176-4d104d770de2",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:57:51.075Z"
        },
        {
          "id": "d0e6184c-cca1-4059-85ca-92fca0ae5337",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:57:51.075Z"
        },
        {
          "id": "1f1a8859-6099-48cf-b4af-66a506249819",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:57:51.075Z"
        },
        {
          "id": "2eae9a05-a80c-4b16-ac2f-8d62ab6ef31d",
          "typ": "nieznany",
          "info": "Przesyłka pomyślnie przekazana do użytkownika upoważnionego adresata, Message successfully handed over to a recipient's delegate",
          "data": "2025-11-28T10:58:45.265Z"
        }
      ],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    },
    {
      "numer": 2210475,
      "idObce": "PPSA-E-39b3f5d0-aace-4320-ad53-0056c3f59e71",
      "data": "2025-11-28T10:06:14.600Z",
      "nazwa": "test",
      "adresatSkrzynka": "AE:PL-98699-88653-IIVRF-38",
      "adresat": {
        "numer": 1541968,
        "identyfikator": "GMINA SOFTRES - KLIENT WEWNĘTRZNY",
        "firma": true,
        "nIP": "8131515513",
        "adres": " 35-526 RZESZÓW ZACISZNA 44 "
      },
      "nadawcaSkrzynka": "AE:PL-92381-99395-GSGHS-29",
      "nadawca": {
        "numer": 2145957,
        "identyfikator": "MEDEKSA AGUNG",
        "firma": false,
        "nIP": "",
        "adres": " 35-048 RZESZÓW KONOPNICKIEJ 12 "
      },
      "tresc": "test",
      "pobrany": false,
      "pobranyData": "2025-12-07T00:52:54.857Z",
      "notatka": "",
      "zalaczniki": [
        {
          "numer": 2210476,
          "plik": "test.txt"
        }
      ],
      "potwierdzenia": [
        {
          "id": "aad766eb-206d-4633-adf2-15a067f9059c",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:06:14.595Z"
        },
        {
          "id": "4218a165-23f9-46db-8f1d-9ca5d0162c6a",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:06:14.595Z"
        },
        {
          "id": "6d7ebb52-22a4-436c-ac83-7759eb75d9c9",
          "typ": "nieznany",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi, Recipient's mailbox succesfully notified about new message",
          "data": "2025-11-28T10:06:14.595Z"
        },
        {
          "id": "b3ffeff7-9ed5-4c34-9ab7-6061bb23ae46",
          "typ": "nieznany",
          "info": "Przesyłka pomyślnie przekazana do użytkownika upoważnionego adresata, Message successfully handed over to a recipient's delegate",
          "data": "2025-11-28T10:07:42.979Z"
        }
      ],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    }
  ];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getEDoreczDokumenty(): Observable<EDoreczDokument[]> {
    const url = `${this.configService.apiBaseUrl}/skrzynki/eDoreczWej`;
    return this.http.get<EDoreczDokument[]>(url).pipe(
      catchError(error => {
        console.warn('Could not fetch eDoreczenia, using mock data:', error);
        return of(this.mockData);
      })
    );
  }
}
