import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TDekretacja } from '../models/dekretacja.model';

@Injectable({
  providedIn: 'root'
})
export class DokumentDekretujService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/dekretuj`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  dekretuj(dekretacja: TDekretacja): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().append('sesja', sesjaId.toString());

    return this.http.post(this.apiUrl, dekretacja, { headers, params });
  }
}
