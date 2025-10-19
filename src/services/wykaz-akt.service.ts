import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WykazAkt } from '../models/wykaz-akt.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WykazAktService {
  private apiUrl = `${environment.apiBaseUrl}/wykazakt`;

  constructor(private http: HttpClient) {}

  getWykazAkt(): Observable<WykazAkt[]> {
    return this.http.get<WykazAkt[]>(this.apiUrl);
  }
}
