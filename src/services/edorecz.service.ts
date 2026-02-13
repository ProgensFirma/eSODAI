import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EDoreczDokument, EDoreczWyslana } from '../models/edorecz.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

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

  private mockWyslaneData: EDoreczWyslana[] = [
    {
      "numer": 2828051,
      "kopertaGlowna": 0,
      "punktNadawczy": {
        "numer": 1,
        "nazwa": "PUNKT GŁÓWNY"
      },
      "wyslana": false,
      "dokument": {
        "numer": 2827800,
        "typ": {
          "nazwa": "WNIOSEK",
          "finansowy": false,
          "polecenieZaplaty": false
        },
        "nazwa": "Wniosek o wydanie zaświadczenia",
        "rejestrNrPozycji": "10997/RPP/24",
        "kontrahent": {
          "numer": 2679291,
          "identyfikator": "ALDESA CONSTRUCCIONES POLSKA",
          "firma": true,
          "nIP": "1234567890",
          "adres": " 38-422 ISKRZYNIA PODKARPACKA 99A "
        }
      },
      "dokWyjscia": {
        "numer": 2828050,
        "rejestrNrPozycji": "5688/RPW/24"
      },
      "adresatSkrzynka": "AE:PL-12345-67890-ABCDE-12",
      "adresat": {
        "numer": 2679291,
        "identyfikator": "ALDESA CONSTRUCCIONES POLSKA",
        "firma": true,
        "nIP": "1234567890",
        "adres": " 38-422 ISKRZYNIA PODKARPACKA 99A "
      },
      "nadawcaSkrzynka": "AE:PL-98765-43210-ZYXWV-98",
      "nadawca": {
        "numer": 284879,
        "identyfikator": "WIOŚ W GDAŃSKU",
        "firma": true,
        "nIP": "5842738392",
        "adres": " 80-387 GDAŃSK NORWIDA CYPRIANA KAMILA 4 "
      },
      "tytul": "Wniosek o wydanie zaświadczenia",
      "tresc": "Uprzejmie proszę o wydanie zaświadczenia o samodzielności lokalu mieszkalnego położonego przy ul. Podkarpackiej 99A w Iskrzyni.\n\nZaświadczenie jest wymagane do celów prawnych związanych z planowaną sprzedażą nieruchomości.",
      "typ": "eDokument",
      "hybryda": null,
      "msgId": "",
      "taskId": "",
      "statusDoreczenia": 0,
      "statusDoreczeniaOpis": "Przygotowana do wysłania",
      "zalaczniki": [
        {
          "numer": 2827801,
          "plik": "wniosek.pdf"
        }
      ],
      "potwierdzenia": [],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    },
    {
      "numer": 2828001,
      "kopertaGlowna": 0,
      "punktNadawczy": {
        "numer": 1,
        "nazwa": "PUNKT GŁÓWNY"
      },
      "wyslana": true,
      "dokument": {
        "numer": 2827850,
        "typ": {
          "nazwa": "PISMO",
          "finansowy": false,
          "polecenieZaplaty": false
        },
        "nazwa": "Pismo ogólne",
        "rejestrNrPozycji": "112/R-DTWI-JBL/24",
        "kontrahent": {
          "numer": 284879,
          "identyfikator": "WIOŚ W GDAŃSKU",
          "firma": true,
          "nIP": "5842738392",
          "adres": " 80-387 GDAŃSK NORWIDA CYPRIANA KAMILA 4 "
        }
      },
      "dokWyjscia": {
        "numer": 2828000,
        "rejestrNrPozycji": "5687/RPW/24"
      },
      "adresatSkrzynka": "AE:PL-98765-43210-ZYXWV-98",
      "adresat": {
        "numer": 284879,
        "identyfikator": "WIOŚ W GDAŃSKU",
        "firma": true,
        "nIP": "5842738392",
        "adres": " 80-387 GDAŃSK NORWIDA CYPRIANA KAMILA 4 "
      },
      "nadawcaSkrzynka": "AE:PL-11111-22222-ABCDE-11",
      "nadawca": {
        "numer": 1875284,
        "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANIOWEJ",
        "firma": true,
        "nIP": "8670003134",
        "adres": " 39-400 TARNOBRZEG PRZEMYSŁOWA 15 "
      },
      "tytul": "Pismo ogólne - sprawa WZ/123/2024",
      "tresc": "W odpowiedzi na Państwa pismo z dnia 16.12.2024 znak WZ/123/2024, uprzejmie informuję, że dokumentacja została zweryfikowana i przyjęta do dalszego procedowania.\n\nW załączeniu przesyłam zaświadczenie zgodnie z wnioskiem.",
      "typ": "eDokument",
      "hybryda": null,
      "msgId": "PPSA-E-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "taskId": "TASK-12345",
      "statusDoreczenia": 3,
      "statusDoreczeniaOpis": "Dostarczone",
      "zalaczniki": [],
      "potwierdzenia": [
        {
          "id": "aa11bb22-cc33-dd44-ee55-ff6677889900",
          "typ": "nadanie",
          "info": "Przesyłka została pomyślnie nadana",
          "data": "2024-12-18T11:00:45.678Z"
        },
        {
          "id": "bb22cc33-dd44-ee55-ff66-778899001122",
          "typ": "dostarczenie",
          "info": "Przesyłka pomyślnie dostarczona do adresata",
          "data": "2024-12-18T14:23:15.234Z"
        }
      ],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    },
    {
      "numer": 2827950,
      "kopertaGlowna": 0,
      "punktNadawczy": {
        "numer": 1,
        "nazwa": "PUNKT GŁÓWNY"
      },
      "wyslana": true,
      "dokument": {
        "numer": 2827900,
        "typ": {
          "nazwa": "NOTA",
          "finansowy": true,
          "polecenieZaplaty": false
        },
        "nazwa": "Nota obciążeniowa",
        "rejestrNrPozycji": "183/R-DJWI-CD/24",
        "kontrahent": {
          "numer": 2770462,
          "identyfikator": "SZPOJNAROWICZ JÓZEFA",
          "firma": false,
          "nIP": "",
          "adres": " 38-604 LESKO HOCZEW 49 "
        }
      },
      "dokWyjscia": {
        "numer": 2827950,
        "rejestrNrPozycji": "5686/RPW/24"
      },
      "adresatSkrzynka": "AE:PL-55555-66666-QWERT-55",
      "adresat": {
        "numer": 2770462,
        "identyfikator": "SZPOJNAROWICZ JÓZEFA",
        "firma": false,
        "nIP": "",
        "adres": " 38-604 LESKO HOCZEW 49 "
      },
      "nadawcaSkrzynka": "AE:PL-11111-22222-ABCDE-11",
      "nadawca": {
        "numer": 1875284,
        "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANIOWEJ",
        "firma": true,
        "nIP": "8670003134",
        "adres": " 39-400 TARNOBRZEG PRZEMYSŁOWA 15 "
      },
      "tytul": "Nota obciążeniowa NO/456/2024",
      "tresc": "Nota obciążeniowa za opłaty administracyjne związane z wydaniem decyzji.\n\nKwota do zapłaty: 450.00 PLN\nTermin płatności: 16.01.2025\n\nProszę o dokonanie płatności na rachunek bankowy:\n12 3456 7890 1234 5678 9012 3456\n\nW tytule przelewu prosimy umieścić: NO/456/2024",
      "typ": "eDokument",
      "hybryda": null,
      "msgId": "PPSA-E-z9y8x7w6-v5u4-3210-zyxw-v9876543210",
      "taskId": "TASK-67890",
      "statusDoreczenia": 3,
      "statusDoreczeniaOpis": "Dostarczone",
      "zalaczniki": [
        {
          "numer": 2827901,
          "plik": "nota_obciazeniowa.pdf"
        }
      ],
      "potwierdzenia": [
        {
          "id": "cc33dd44-ee55-ff66-7788-99001122aa33",
          "typ": "nadanie",
          "info": "Przesyłka została pomyślnie nadana",
          "data": "2024-12-17T15:00:12.345Z"
        },
        {
          "id": "dd44ee55-ff66-7788-9900-1122aa33bb44",
          "typ": "preawizacja",
          "info": "Przesyłka została pomyślnie preawizowana adresatowi",
          "data": "2024-12-17T15:00:13.456Z"
        },
        {
          "id": "ee55ff66-7788-9900-1122-aa33bb44cc55",
          "typ": "dostarczenie",
          "info": "Przesyłka pomyślnie dostarczona do adresata",
          "data": "2024-12-17T18:45:32.789Z"
        }
      ],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    },
    {
      "numer": 2828100,
      "kopertaGlowna": 0,
      "punktNadawczy": {
        "numer": 1,
        "nazwa": "PUNKT GŁÓWNY"
      },
      "wyslana": false,
      "dokument": {
        "numer": 2806367,
        "typ": {
          "nazwa": "DECYZJA",
          "finansowy": false,
          "polecenieZaplaty": false
        },
        "nazwa": "DECYZJA",
        "rejestrNrPozycji": "10940/RPP/24",
        "kontrahent": {
          "numer": 1371332,
          "identyfikator": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE",
          "firma": true,
          "nIP": "8133476589",
          "adres": " 35-959 RZESZÓW GRUNWALDZKA 15 "
        }
      },
      "dokWyjscia": {
        "numer": 2828101,
        "rejestrNrPozycji": "5689/RPW/24"
      },
      "adresatSkrzynka": "AE:PL-55555-66666-QWERT-55",
      "adresat": {
        "numer": 1371332,
        "identyfikator": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE",
        "firma": true,
        "nIP": "8133476589",
        "adres": " 35-959 RZESZÓW GRUNWALDZKA 15 "
      },
      "nadawcaSkrzynka": "AE:PL-11111-22222-ABCDE-11",
      "nadawca": {
        "numer": 1875284,
        "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANIOWEJ",
        "firma": true,
        "nIP": "8670003134",
        "adres": " 39-400 TARNOBRZEG PRZEMYSŁOWA 15 "
      },
      "tytul": "Decyzja administracyjna",
      "tresc": "Decyzja w sprawie odwołania od decyzji wydanej przez organ I instancji.\n\nDECYZJA\nNa podstawie art. 138 § 1 pkt 1 ustawy z dnia 14 czerwca 1960 r. - Kodeks postępowania administracyjnego (Dz. U. z 2021 r. poz. 735) po rozpatrzeniu odwołania Strony postanawia utrzymać w mocy decyzję organu I instancji.",
      "typ": "eDokument",
      "hybryda": null,
      "msgId": "",
      "taskId": "",
      "statusDoreczenia": 0,
      "statusDoreczeniaOpis": "Przygotowana do wysłania",
      "zalaczniki": [],
      "potwierdzenia": [],
      "oper": "tboSelect",
      "status": "sOK",
      "statusDane": ""
    }
  ];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getEDoreczDokumenty(): Observable<EDoreczDokument[]> {
    const url = `${this.configService.apiBaseUrl}/skrzynki/eDoreczWej`;
    return this.http.get<EDoreczDokument[]>(url).pipe(
      catchError(error => {
        console.warn('Could not fetch eDoreczenia, using mock data:', error);

        if (!environment.production) {
          return of(this.mockData);
        } else {
          this.errorService.showError(
            'Błąd pobierania eDoręczeń',
            'Nie udało się pobrać listy eDoręczeń przychodzących z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }

  getEDoreczWyslane(zalInfo: boolean, potwInfo: boolean, rekStart: number, rekIlosc: number): Observable<EDoreczWyslana[]> {
    const session = this.authService.getCurrentSession();
    if (!session || !session.sesja) {
      if (!environment.production) {
        return of(this.mockWyslaneData);
      } else {
        this.errorService.showError(
          'Błąd sesji',
          'Brak aktywnej sesji użytkownika.'
        );
        return throwError(() => new Error('No active session'));
      }
    }

    const url = `${this.configService.apiBaseUrl}/api/skrzynki/eDoreczWys`;
    let params = new HttpParams()
      .set('sesja', session.sesja.toString())
      .set('zalInfo', zalInfo.toString())
      .set('potwInfo', potwInfo.toString())
      .set('rekStart', rekStart.toString())
      .set('rekIlosc', rekIlosc.toString());

    return this.http.get<EDoreczWyslana[]>(url, { params }).pipe(
      catchError(error => {
        console.warn('Could not fetch eDoreczenia wyslane, using mock data:', error);

        if (!environment.production) {
          return of(this.mockWyslaneData);
        } else {
          this.errorService.showError(
            'Błąd pobierania eDoręczeń',
            'Nie udało się pobrać listy eDoręczeń wysłanych z serwera.'
          );
          return throwError(() => error);
        }
      })
    );
  }
}
