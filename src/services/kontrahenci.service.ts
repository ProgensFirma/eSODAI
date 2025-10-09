import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { KontrahentDetailed, KontrahenciResponse } from '../models/kontrahent.model';

@Injectable({
  providedIn: 'root'
})
export class KontrahenciService {
  private apiUrl = 'http://localhost:8448/kontrahenci';

  constructor(private http: HttpClient) {}

  getKontrahenci(rekStart: number = 1, rekIlosc: number = 10, fraza: string = ''): Observable<KontrahenciResponse> {
    let params = new HttpParams()
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
        const wynikIlosc = response.headers.get('WynikIlosc');
        return {
          data: response.body || [],
          wynikIlosc: wynikIlosc ? parseInt(wynikIlosc, 10) : undefined
        };
      }),
      catchError(error => {
        console.error('Error fetching kontrahenci:', error);
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
        "nIP": "1234567890",
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
        "oper": "tboSelect",
        "status": "sOK",
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
        "nIP": "",
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
        "oper": "tboSelect",
        "status": "sOK",
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