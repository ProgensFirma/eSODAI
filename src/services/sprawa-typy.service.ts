import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSprawaTyp } from '../models/sprawa-typ.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SprawaTypyService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getSprawaTypy(sesja: string): Observable<TSprawaTyp[]> {
    const params = new HttpParams().set('sesja', sesja);
    return this.http.get<TSprawaTyp[]>(`${this.configService.apiBaseUrl}/sprawy/typy`, { params });
  }
}
