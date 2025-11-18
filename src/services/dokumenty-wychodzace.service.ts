import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DokumentWychodzacy } from '../models/dokument-wychodzacy.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DokumentyWychodzaceService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getDokumentyWychodzace(
    sesja: number,
    rejestr?: string,
    rejestrRok?: number
  ): Observable<DokumentWychodzacy[]> {
    let params = new HttpParams().set('sesja', sesja.toString());

    if (rejestr) {
      params = params.set('rejestr', rejestr);
    }

    if (rejestrRok) {
      params = params.set('RejestrRok', rejestrRok.toString());
    }

    return this.http.get<DokumentWychodzacy[]>(`${this.configService.apiBaseUrl}/dokWyjscia`, { params });
  }
}
