import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WykazAkt } from '../models/wykaz-akt.model';

@Injectable({
  providedIn: 'root'
})
export class WykazAktService {
  private apiUrl = 'http://localhost:8448/wykazakt';

  constructor(private http: HttpClient) {}

  getWykazAkt(): Observable<WykazAkt[]> {
    return this.http.get<WykazAkt[]>(this.apiUrl);
  }
}
