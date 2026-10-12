import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentPieczecService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/zalacznik/pieczec`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  pieczecZalacznik(dokument: number, zalacznik: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('numer', zalacznik.toString())
      .append('dokument', dokument.toString());

    return this.http.get(this.apiUrl, { headers, params });
  }
}
