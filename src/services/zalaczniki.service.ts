import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ZalacznikTresc } from '../models/zalacznik.model';

@Injectable({
  providedIn: 'root'
})
export class ZalacznikiService {
  private apiUrl = 'http://localhost:8448/skrzynki';

  constructor(private http: HttpClient) {}

  getZalacznikTresc(dokument: number, numer: number): Observable<ZalacznikTresc> {
    const params = {
      dokument: dokument.toString(),
      numer: numer.toString()
    };

    return this.http.get<ZalacznikTresc>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching attachment content:', error);
        // Return mock data for development
        return of(this.getMockData(dokument, numer));
      })
    );
  }

  private getMockData(dokument: number, numer: number): ZalacznikTresc {
    return {
      numer: numer,
      plik: "example.pdf",
      dokument: dokument,
      kolejnosc: 1,
      archiuwum: false,
      data: "2024-10-23T00:00:00.000Z",
      edycja: false,
      wersja: 1,
      wersjaOpis: "",
      tresc: "To jest przykładowa treść załącznika. Zawiera informacje dotyczące dokumentu oraz szczegółowe dane, które mogą być przydatne dla użytkownika. Treść może zawierać różne rodzaje informacji w zależności od typu załącznika.",
      oper: "tboSelect",
      status: "sOK",
      statusDane: ""
    };
  }
}