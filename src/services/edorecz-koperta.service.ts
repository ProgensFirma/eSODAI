import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { EdoreczPunktNadawczy } from '../models/edorecz-punkt-nadawczy.model';

@Injectable({
  providedIn: 'root'
})
export class EdoreczKopertaService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private useMockData = true;

  private mockPunktyNadawcze: EdoreczPunktNadawczy[] = [
    {
      numer: 1,
      nazwa: 'Punkt Nadawczy - Wydział Administracyjny',
      domyslny: true,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    {
      numer: 2,
      nazwa: 'Punkt Nadawczy - Wydział Finansowy',
      domyslny: false,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    },
    {
      numer: 3,
      nazwa: 'Punkt Nadawczy - Sekretariat',
      domyslny: false,
      oper: 'tboSelect',
      status: 'sOK',
      statusDane: ''
    }
  ];

  getPunktyNadawcze(): Observable<EdoreczPunktNadawczy[]> {
    if (this.useMockData) {
      return of(this.mockPunktyNadawcze);
    }
    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<EdoreczPunktNadawczy[]>(`${apiUrl}/eDorecz/PunktyNadawcze`);
  }
}
