import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { KontrahWew } from '../models/kontrah-wew.model';

@Injectable({
  providedIn: 'root'
})
export class KontrahWewService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getDaneNadawcy(punktNumer: number): Observable<KontrahWew> {
    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<KontrahWew>(`${apiUrl}/KontrahWew`, {
      params: { punktNumer: punktNumer.toString() }
    });
  }
}
