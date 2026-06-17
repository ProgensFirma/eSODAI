import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentWyslijService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/wyslij`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  sprawdzWyslij(dokument: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .set('sesja', sesjaId.toString())
      .set('dokument', dokument.toString());

    return this.http.get(`${this.apiUrl}/sprawdz`, { params });
  }

  wyslij(dokument: number, rodzajNazwa: string, kontrahentNumer?: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());
    const body: Record<string, unknown> = { dokument, rodzaj: rodzajNazwa };
    if (kontrahentNumer !== undefined) {
      body['kontrahent'] = kontrahentNumer;
    }

    return this.http.post(this.apiUrl, body, { params });
  }
}

