import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
import { Przypomnienie } from '../models/przypomnienie.model';

@Injectable({ providedIn: 'root' })
export class PrzypomnienieService {
  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/przypomnienie`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getPrzypomnienie(numer: number): Observable<Przypomnienie> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams()
      .set('sesja', sesjaId.toString())
      .set('numer', numer.toString());

    return this.http.get<Przypomnienie>(this.apiUrl, { params }).pipe(
      catchError((err) => {
        if (!environment.production) {
          return of({
            numer,
            rodzaj: 'tp_przyp',
            archiwum: false,
            osoba: { numer: 1, identyfikator: 'Jan Kowalski' },
            osobaZlec: { numer: 2, identyfikator: 'Anna Nowak' },
            typPowiaz: 'htDokument',
            dokument: {
              numer: 101,
              typ: { nazwa: 'Pismo przychodzące', finansowy: false, poleceniezaplaty: false },
              nazwa: 'Wniosek o wydanie decyzji administracyjnej',
              rejestrNrPozycji: 'KOR/2026/00042',
              kontrahent: { numer: 5, identyfikator: 'ABC Sp. z o.o.', firma: true, nip: '123-456-78-90', adres: 'ul. Testowa 1, 00-001 Warszawa' }
            },
            sprawa: {
              numer: 55,
              znaksprawy: 'OR.0012.5.2026',
              nazwa: 'Postępowanie w sprawie wydania decyzji',
              glowna: true,
              zakonczona: false
            },
            harmonogram: { cykliczne: false },
            dataCzas: new Date().toISOString(),
            naglowek: 'Przypomnienie o terminie realizacji',
            tresc: 'Upływa termin rozpatrzenia wniosku złożonego przez ABC Sp. z o.o. Proszę o pilną weryfikację stanu sprawy i podjęcie stosownych działań.',
            dataPrzyj: '',
            potwierdz: false,
          } as unknown as Przypomnienie);
        }
        throw err;
      })
    );
  }

  przeczytane(numer: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().set('sesja', sesjaId.toString());

    return this.http.post(`${this.apiUrl}/przeczytane`, { numer }, { params }).pipe(
      catchError((err) => {
        if (!environment.production) {
          return of({});
        }
        throw err;
      })
    );
  }
}
