import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

export interface DokumentPrzekazRequest {
  Dokument: number;
  Jednostka: string;
  Osoba: number;
}

@Injectable({
  providedIn: 'root'
})
export class DokumentPrzekazService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/przekaz`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  przekazDokument(request: DokumentPrzekazRequest): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.post(this.apiUrl, request, { headers, params });
  }
}
