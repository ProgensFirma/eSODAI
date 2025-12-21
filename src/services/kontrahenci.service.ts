import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { KontrahentDetailed, KontrahenciResponse } from '../models/kontrahent.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class KontrahenciService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/kontrahenci`;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getKontrahenci(rekStart: number = 1, rekIlosc: number = 10, fraza: string = ''): Observable<KontrahenciResponse> {
    
    let params = new HttpParams()
      .set('sesja', '123')
      .set('rekStart', rekStart.toString())
      .set('rekIlosc', rekIlosc.toString());

    if (fraza) {
      params = params.set('fraza', fraza);
    }

    return this.http.get<KontrahentDetailed[]>(this.apiUrl, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<KontrahentDetailed[]>) => {
        const wynikIlosc = response.headers.get('qIlosc');
        return {
          data: response.body || [],
          wynikIlosc: wynikIlosc ? parseInt(wynikIlosc, 10) : undefined
        };
      }),
      catchError(error => {
        console.error('Error fetching kontrahenci:', error);
        // Return mock data for development        
        return of(this.getMockData(rekStart, rekIlosc));
      })
    );
  }

  private getMockData(rekStart: number, rekIlosc: number): KontrahenciResponse {
    const mockData: KontrahentDetailed[] = [
      {
        "numer": 2679291,
        "archiwum": false,
        "identyfikator": "ALDESA CONSTRUCCIONES POLSKA SPÓŁKA Z OGRANICZONĄ",
        "nazwa": "ALDESA CONSTRUCCIONES POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
        "imie": "",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1899-12-30T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": true,
        "grupa": "",
        "pesel": "",
        "nip": "1234567890",
        "regon": "120522027",
        "kRS": "",
        "odID": "",
        "kontakt": {
          "telefon": "+48 123 456 789",
          "telefon2": "",
          "email": "kontakt@aldesa.pl",
          "wWW": "www.aldesa.pl",
          "epuapAdres": "",
          "eDoreczAdres": "",
          "sMSZgoda": false,
          "emailZgoda": true,
          "epuapZgoda": false,
          "eDoreczZgoda": false
        },
        "opis": "",
        "nazwaDluga": "",
        "uwagi": "",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "krośnieński",
          "gmina": "Iskrzynia",
          "ulicaTyp": "ul.",
          "typ": "ta_zamieszkania",
          "kodPoczta": "38-422",
          "poczta": "ISKRZYNIA",
          "miejscowosc": "ISKRZYNIA",
          "ulica": "PODKARPACKA",
          "nrDomu": "99A",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "krośnieński",
          "gmina": "Iskrzynia",
          "ulicaTyp": "ul.",
          "typ": "ta_koresp",
          "kodPoczta": "38-422",
          "poczta": "ISKRZYNIA",
          "miejscowosc": "ISKRZYNIA",
          "ulica": "PODKARPACKA",
          "nrDomu": "99A",
          "nrLokalu": ""
        },
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2770462,
        "archiwum": true,
        "identyfikator": "SZPOJNAROWICZ JÓZEFA",
        "nazwa": "SZPOJNAROWICZ",
        "imie": "JÓZEFA",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1950-05-15T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": false,
        "grupa": "",
        "pesel": "50051512345",
        "nip": "",
        "regon": "",
        "kRS": "",
        "odID": "",
        "kontakt": {
          "telefon": "",
          "telefon2": "",
          "email": "",
          "wWW": "",
          "epuapAdres": "",
          "eDoreczAdres": "",
          "sMSZgoda": false,
          "emailZgoda": false,
          "epuapZgoda": false,
          "eDoreczZgoda": false
        },
        "opis": "",
        "nazwaDluga": "",
        "uwagi": "",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "leski",
          "gmina": "Lesko",
          "ulicaTyp": "",
          "typ": "ta_zamieszkania",
          "kodPoczta": "38-604",
          "poczta": "LESKO",
          "miejscowosc": "HOCZEW",
          "ulica": "49",
          "nrDomu": "",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "leski",
          "gmina": "Lesko",
          "ulicaTyp": "",
          "typ": "ta_koresp",
          "kodPoczta": "38-604",
          "poczta": "LESKO",
          "miejscowosc": "HOCZEW",
          "ulica": "49",
          "nrDomu": "",
          "nrLokalu": ""
        },
        
        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 2654837,
        "archiwum": false,
        "identyfikator": "POWIAT MIELECKI",
        "nazwa": "POWIAT MIELECKI",
        "imie": "",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1899-12-30T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": true,
        "grupa": "",
        "pesel": "",
        "nip": "8171514890",
        "regon": "690568745",
        "kRS": "0000145678",
        "odID": "",
        "kontakt": {
          "telefon": "+48 17 788 44 00",
          "telefon2": "+48 17 788 44 01",
          "email": "sekretariat@powiat.mielec.pl",
          "wWW": "www.powiat.mielec.pl",
          "epuapAdres": "/powiatmielecki/SkrytkaESP",
          "eDoreczAdres": "AE:PL-12345-67890-ABCDE-12",
          "sMSZgoda": false,
          "emailZgoda": true,
          "epuapZgoda": true,
          "eDoreczZgoda": true
        },
        "opis": "Starostwo Powiatowe w Mielcu",
        "nazwaDluga": "STAROSTWO POWIATOWE W MIELCU",
        "uwagi": "",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "mielecki",
          "gmina": "Mielec",
          "ulicaTyp": "ul.",
          "typ": "ta_zamieszkania",
          "kodPoczta": "39-300",
          "poczta": "MIELEC",
          "miejscowosc": "MIELEC",
          "ulica": "RZESZOWSKA",
          "nrDomu": "1",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "mielecki",
          "gmina": "Mielec",
          "ulicaTyp": "ul.",
          "typ": "ta_koresp",
          "kodPoczta": "39-300",
          "poczta": "MIELEC",
          "miejscowosc": "MIELEC",
          "ulica": "RZESZOWSKA",
          "nrDomu": "1",
          "nrLokalu": ""
        },

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 1875284,
        "archiwum": false,
        "identyfikator": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANI",
        "nazwa": "PRZEDSIĘBIORSTWO GOSPODARKI KOMUNALNEJ I MIESZKANIOWEJ",
        "imie": "",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1899-12-30T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": true,
        "grupa": "",
        "pesel": "",
        "nip": "8670003134",
        "regon": "830348956",
        "kRS": "0000234567",
        "odID": "",
        "kontakt": {
          "telefon": "+48 15 811 22 33",
          "telefon2": "",
          "email": "biuro@pgkim.pl",
          "wWW": "www.pgkim.pl",
          "epuapAdres": "/pgkim/SkrytkaESP",
          "eDoreczAdres": "",
          "sMSZgoda": false,
          "emailZgoda": true,
          "epuapZgoda": true,
          "eDoreczZgoda": false
        },
        "opis": "Przedsiębiorstwo zajmujące się gospodarką komunalną",
        "nazwaDluga": "",
        "uwagi": "Główny partner w zakresie gospodarki odpadami",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "tarnobrzeski",
          "gmina": "Tarnobrzeg",
          "ulicaTyp": "ul.",
          "typ": "ta_zamieszkania",
          "kodPoczta": "39-400",
          "poczta": "TARNOBRZEG",
          "miejscowosc": "TARNOBRZEG",
          "ulica": "PRZEMYSŁOWA",
          "nrDomu": "15",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "tarnobrzeski",
          "gmina": "Tarnobrzeg",
          "ulicaTyp": "ul.",
          "typ": "ta_koresp",
          "kodPoczta": "39-400",
          "poczta": "TARNOBRZEG",
          "miejscowosc": "TARNOBRZEG",
          "ulica": "PRZEMYSŁOWA",
          "nrDomu": "15",
          "nrLokalu": ""
        },

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 284879,
        "archiwum": false,
        "identyfikator": "WIOŚ W GDAŃSKU",
        "nazwa": "WOJEWÓDZKI INSPEKTORAT OCHRONY ŚRODOWISKA W GDAŃSKU",
        "imie": "",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1899-12-30T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": true,
        "grupa": "urzędy",
        "pesel": "",
        "nip": "5842738392",
        "regon": "000290165",
        "kRS": "",
        "odID": "",
        "kontakt": {
          "telefon": "+48 58 326 32 65",
          "telefon2": "+48 58 326 32 66",
          "email": "sekretariat@gdansk.wios.gov.pl",
          "wWW": "www.gdansk.wios.gov.pl",
          "epuapAdres": "/wiosgdansk/SkrytkaESP",
          "eDoreczAdres": "AE:PL-98765-43210-ZYXWV-98",
          "sMSZgoda": false,
          "emailZgoda": true,
          "epuapZgoda": true,
          "eDoreczZgoda": true
        },
        "opis": "Wojewódzki Inspektorat Ochrony Środowiska",
        "nazwaDluga": "WOJEWÓDZKI INSPEKTORAT OCHRONY ŚRODOWISKA W GDAŃSKU",
        "uwagi": "",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "pomorskie",
          "powiat": "Gdańsk",
          "gmina": "Gdańsk",
          "ulicaTyp": "ul.",
          "typ": "ta_zamieszkania",
          "kodPoczta": "80-387",
          "poczta": "GDAŃSK",
          "miejscowosc": "GDAŃSK",
          "ulica": "NORWIDA CYPRIANA KAMILA",
          "nrDomu": "4",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "pomorskie",
          "powiat": "Gdańsk",
          "gmina": "Gdańsk",
          "ulicaTyp": "ul.",
          "typ": "ta_koresp",
          "kodPoczta": "80-387",
          "poczta": "GDAŃSK",
          "miejscowosc": "GDAŃSK",
          "ulica": "NORWIDA CYPRIANA KAMILA",
          "nrDomu": "4",
          "nrLokalu": ""
        },

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      },
      {
        "numer": 1371332,
        "archiwum": false,
        "identyfikator": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE",
        "nazwa": "SAMORZĄDOWE KOLEGIUM ODWOŁAWCZE W RZESZOWIE",
        "imie": "",
        "imie2": "",
        "imieOjca": "",
        "imieMatki": "",
        "dataUrodzenia": "1899-12-30T00:00:00.000Z",
        "dataZgonu": "1899-12-30T00:00:00.000Z",
        "firma": true,
        "grupa": "urzędy",
        "pesel": "",
        "nip": "8133476589",
        "regon": "690025478",
        "kRS": "",
        "odID": "",
        "kontakt": {
          "telefon": "+48 17 853 68 21",
          "telefon2": "+48 17 853 68 22",
          "email": "sko@sko.rzeszow.pl",
          "wWW": "www.sko.rzeszow.pl",
          "epuapAdres": "/skorzeszow/SkrytkaESP",
          "eDoreczAdres": "AE:PL-55555-66666-QWERT-55",
          "sMSZgoda": false,
          "emailZgoda": true,
          "epuapZgoda": true,
          "eDoreczZgoda": true
        },
        "opis": "Organ odwoławczy II instancji",
        "nazwaDluga": "",
        "uwagi": "",
        "adresStaly": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "Rzeszów",
          "gmina": "Rzeszów",
          "ulicaTyp": "ul.",
          "typ": "ta_zamieszkania",
          "kodPoczta": "35-959",
          "poczta": "RZESZÓW",
          "miejscowosc": "RZESZÓW",
          "ulica": "GRUNWALDZKA",
          "nrDomu": "15",
          "nrLokalu": ""
        },
        "adresKoresp": {
          "kraj": "Polska",
          "woj": "podkarpackie",
          "powiat": "Rzeszów",
          "gmina": "Rzeszów",
          "ulicaTyp": "ul.",
          "typ": "ta_koresp",
          "kodPoczta": "35-959",
          "poczta": "RZESZÓW",
          "miejscowosc": "RZESZÓW",
          "ulica": "GRUNWALDZKA",
          "nrDomu": "15",
          "nrLokalu": ""
        },

        "oper": TBazaOper.tboSelect,
        "status": TeSodStatus.sOK,
        "statusDane": ""
      }
    ];

    // Simulate pagination
    const startIndex = (rekStart - 1);
    const endIndex = startIndex + rekIlosc;
    const paginatedData = mockData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      wynikIlosc: rekStart === 1 ? 25 : undefined // Mock total count
    };
  }
}