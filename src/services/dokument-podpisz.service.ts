import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentPodpiszService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/podpisz`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  podpiszDokument(dokument: number, tylkoOznacz: boolean = false): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().append('sesja', sesjaId.toString());

    const body: any = { dokument };
    if (tylkoOznacz) {
      body.tylkoOznacz = true;
    }

    return this.http.post(this.apiUrl, body, { headers, params });
  }
}
