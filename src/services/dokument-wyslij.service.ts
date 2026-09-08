import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
import { TDokWyjRodzajWysylki } from '../models/dok-wyj-rodzaj-wysylki.model';

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

    return this.http.get(`${this.apiUrl}/sprawdz`, { params, observe: 'response' }).pipe(
      map((resp) => ({
        wysylkaIstnieje: resp.status === 200,
        dokWy: resp.status === 200 ? resp.body : null
      }))
    );
  }

  wyslij(dokument: number, rodzaj: TDokWyjRodzajWysylki, kontrahentNumer?: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());
    const body: Record<string, unknown> = { dokument, rodzaj };
    if (kontrahentNumer !== undefined) {
      body['kontrahent'] = kontrahentNumer;
    }

    return this.http.post(this.apiUrl, body, { params }).pipe(
      catchError((err) => {
        if (!environment.production) {
          return of({});
        }
        throw err;
      })
    );
  }
}

