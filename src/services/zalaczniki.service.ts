import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ZalacznikTresc } from '../models/zalacznik.model';
import { ConfigService } from './config.service';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class ZalacznikiService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/zalacznik`;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getZalacznikTresc(dokument: number, numer: number): Observable<ZalacznikTresc> {
    
    const params = {
      sesja: '123',
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

  uploadZalacznik(zalacznik: ZalacznikTresc): Observable<any> {
    return this.http.post(this.apiUrl, zalacznik);
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
      
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sOK,
      statusDane: ""
    };
  }
}