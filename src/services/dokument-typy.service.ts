import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DokumentTyp } from '../models/dokument-typ.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DokumentTypyService {
  private baseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getDokumentTypy(): Observable<DokumentTyp[]> {
    return this.http.get<DokumentTyp[]>(
      `${this.baseUrl}/dokumenty/typy/`,
      { headers: this.getHeaders() }
    );
  }

  saveDokument(dokument: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/dokumenty/dokument`,
      dokument,
      { headers: this.getHeaders() }
    );
  }
}
