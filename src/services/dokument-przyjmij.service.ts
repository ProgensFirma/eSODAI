import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentPrzyjmijService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/przyjmij`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  przyjmijDokument(dokument: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.post(this.apiUrl, { dokument }, { headers, params });
  }
}
