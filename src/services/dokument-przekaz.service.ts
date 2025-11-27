import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

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

  constructor(private http: HttpClient, private configService: ConfigService) {}

  przekazDokument(request: DokumentPrzekazRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, request, { headers });
  }
}
