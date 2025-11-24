import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DokumentTyp } from '../models/dokument-typ.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentTypyService {
  private get baseUrl(): string {
    return this.configService.apiBaseUrl;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getDokumentTypy(): Observable<DokumentTyp[]> {
    const sesja = this.authService.getCurrentSession()?.sesja || 0;

    const params = new HttpParams()
      .append('sesja', sesja);

    return this.http.get<DokumentTyp[]>(
      `${this.baseUrl}/dokumenty/typy/slownik`,
      { headers: this.getHeaders(), params: params }
    );
  }

  saveDokument(dokument: any): Observable<any> {
    const sesja = this.authService.getCurrentSession()?.sesja || 0;

    const params = new HttpParams()
      .append('sesja', sesja);

    return this.http.post(
      `${this.baseUrl}/dokumenty/dokument`,
      dokument,
      { headers: this.getHeaders(), params: params }
    );
  }
  
}
