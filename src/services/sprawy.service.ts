import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Sprawa } from '../models/sprawa.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprawyService {
  private apiUrl = `${environment.apiBaseUrl}/skrzynki/sprawy`;

  constructor(private http: HttpClient) {}

  getSprawy(skrzynka: number): Observable<Sprawa[]> {
    const params = {
      skrzynka: skrzynka.toString()
    };

    return this.http.get<Sprawa[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching sprawy:', error);
        return of([]);
      })
    );
  }
}
