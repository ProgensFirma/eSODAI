import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TOsobaInfo } from '../models/typy-info.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PracownicyService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/pracownicy`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  getPracownicy(jednostka: string): Observable<TOsobaInfo[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('jednostka', jednostka);

    return this.http.get<TOsobaInfo[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching pracownicy:', error);
        return of([]);
      })
    );
  }
}
