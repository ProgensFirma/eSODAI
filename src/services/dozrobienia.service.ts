import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { DoZrobieniaResponse, DoZrobieniaItem, DoZrobieniaTyp } from '../models/dozrobienia.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoZrobieniaService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getDoZrobienia(): Observable<DoZrobieniaResponse> {
    const session = this.authService.getCurrentSession();
    const url = `${this.configService.apiBaseUrl}/dozrobienia`;

    return this.http.get<DoZrobieniaResponse>(url, {
      params: { sesja: session?.sesja?.toString() || '' }
    }).pipe(
      catchError(() => {
        if (!environment.production) {
          console.warn('Błąd pobierania danych z API, używam danych mockowych');
          return of(this.getMockData());
        }
        throw new Error('Błąd pobierania listy do zrobienia');
      })
    );
  }

  private getMockData(): DoZrobieniaResponse {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setMonth(futureDate.getMonth() + 5);

    const pastDate = new Date(currentDate);
    pastDate.setMonth(pastDate.getMonth() - 5);

    return {
      dozrobienia: [
        {
          typ: DoZrobieniaTyp.Sprawy,
          numer: 1,
          nazwa: 'Rozpatrzenie wniosku budowlanego - Kowalski',
          znak: '01/0100/2026',
          data: futureDate.toISOString().split('T')[0],
          dotyczy: 'Jan Kowalski'
        },
        {
          typ: DoZrobieniaTyp.Sprawy,
          numer: 2,
          nazwa: 'Decyzja o warunkach zabudowy - ul. Polna',
          znak: '02/0150/2026',
          data: futureDate.toISOString().split('T')[0],
          dotyczy: 'Anna Nowak'
        },
        {
          typ: DoZrobieniaTyp.Sprawy,
          numer: 3,
          nazwa: 'Pozwolenie na użytkowanie obiektu',
          znak: '03/0200/2026',
          data: currentDate.toISOString().split('T')[0],
          dotyczy: 'Piotr Wiśniewski'
        },
        {
          typ: DoZrobieniaTyp.Dokumenty,
          numer: 1237,
          nazwa: 'Wniosek o wydanie zaświadczenia',
          znak: '01/RP/2026',
          data: futureDate.toISOString().split('T')[0],
          dotyczy: 'Maria Dąbrowska'
        },
        {
          typ: DoZrobieniaTyp.Dokumenty,
          numer: 12222,
          nazwa: 'Skarga na decyzję administracyjną',
          znak: '02/RP/2026',
          data: pastDate.toISOString().split('T')[0],
          dotyczy: 'Krzysztof Lewandowski'
        },
        {
          typ: DoZrobieniaTyp.Dokumenty,
          numer: 15678,
          nazwa: 'Zapytanie ofertowe - dostawa materiałów',
          znak: '03/RP/2026',
          data: currentDate.toISOString().split('T')[0],
          dotyczy: 'Zofia Kamińska'
        },
        {
          typ: DoZrobieniaTyp.EDorecz,
          numer: 3458,
          nazwa: 'Doręczenie elektroniczne - postępowanie administracyjne',
          znak: '01/ED/2026',
          data: futureDate.toISOString().split('T')[0],
          dotyczy: 'Tomasz Szymański'
        },
        {
          typ: DoZrobieniaTyp.EDorecz,
          numer: 3459,
          nazwa: 'Pismo z urzędu skarbowego',
          znak: '02/ED/2026',
          data: currentDate.toISOString().split('T')[0],
          dotyczy: 'Ewa Wójcik'
        }
      ]
    };
  }
}
