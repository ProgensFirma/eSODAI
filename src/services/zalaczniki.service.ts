import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ZalacznikTresc } from '../models/zalacznik.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class ZalacznikiService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/zalacznik`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  getZalacznikTresc(sesja: number, dokument: number, numer: number): Observable<ZalacznikTresc> {

    const params = {
      sesja: sesja.toString(),
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
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.post(this.apiUrl, zalacznik, { params });
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