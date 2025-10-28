import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<WykazAkt[]>(this.apiUrl);
  }
}
