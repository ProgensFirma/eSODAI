import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { KontrahWew } from '../models/kontrah-wew.model';

@Injectable({
  providedIn: 'root'
})
export class KontrahWewService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private authService = inject(AuthService);
  private useMockData = true;

  private mockDaneNadawcy: { [key: number]: KontrahWew } = {
    1: {
      numer: 1541968,
      nazwa: 'GMINA SOFTRES - Wydział Administracyjny',
      epuapSkrytka: '',
      aDE: 'AE:PL-98699-88653-IIVRF-38',
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    2: {
      numer: 1541969,
      nazwa: 'GMINA SOFTRES - Wydział Finansowy',
      epuapSkrytka: '',
      aDE: 'AE:PL-98699-88653-IIVRF-39',
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    3: {
      numer: 1541970,
      nazwa: 'GMINA SOFTRES - Sekretariat',
      epuapSkrytka: '',
      aDE: 'AE:PL-98699-88653-IIVRF-40',
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    }
  };

  getDaneNadawcy(punktNumer: number): Observable<KontrahWew> {
    if (this.useMockData) {
      const mockData = this.mockDaneNadawcy[punktNumer] || this.mockDaneNadawcy[1];
      return of(mockData);
    }

    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString())
      .append('punktNumer', punktNumer.toString());

    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<KontrahWew>(`${apiUrl}/KontrahWew`, { params });
  }
}
