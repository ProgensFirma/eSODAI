import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WykazAkt } from '../models/wykaz-akt.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WykazAktService {
  
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/wykazakt`;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getWykazAkt(): Observable<WykazAkt[]> {

    const params = new HttpParams()
    .append('sesja', 123); 
    
    return this.http.get<WykazAkt[]>(this.apiUrl, { params: params });
  }
}