import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TZadNaDzisResponse, TZadNaDzisTyp, TZadNaDzisStats } from '../models/dozrobienia.model';
import { TBazaOper, TeSodStatus, TSkrzynki } from '../models/enums.model';
import { environment } from '../environments/environment';

const DEFAULT_STATS: TZadNaDzisStats = {
  [TZadNaDzisTyp.Sprawa]:      { ilosc: 0, wyswDla0: true },
  [TZadNaDzisTyp.Dokument]:    { ilosc: 0, wyswDla0: true },
  [TZadNaDzisTyp.EDorecz]:     { ilosc: 0, wyswDla0: true },
  [TZadNaDzisTyp.DokWyslane]:  { ilosc: 0, wyswDla0: false },
};

@Injectable({
  providedIn: 'root'
})
export class DoZrobieniaService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getDoZrobienia(): Observable<TZadNaDzisResponse> {
    const session = this.authService.getCurrentSession();
    const url = `${this.configService.apiBaseUrl}/zadnadzis`;

    return this.http.get<any>(url, {
      params: { sesja: session?.sesja?.toString() || '' }
    }).pipe(
      map(response => this.normalizeResponse(response)),
      catchError(() => {
        if (!environment.production) {
          console.warn('Błąd pobierania danych z API, używam danych mockowych');
          return of(this.getMockData());
        }
        throw new Error('Błąd pobierania listy do zrobienia');
      })
    );
  }

  private normalizeResponse(response: any): TZadNaDzisResponse {
    if (response && typeof response === 'object' && !Array.isArray(response) && response.elementy) {
      return {
        stats: this.parseStats(response.podsumowanie),
        dozrobienia: Array.isArray(response.elementy) ? response.elementy : [],
        oper: response.oper ?? TBazaOper.tboSelect,
        status: response.status ?? TeSodStatus.sBrak,
        statusDane: response.statusDane ?? '',
      };
    }
    if (Array.isArray(response)) {
      return { stats: { ...DEFAULT_STATS }, dozrobienia: response, oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' };
    }
    return { stats: { ...DEFAULT_STATS }, dozrobienia: [], oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' };
  }

  private parseStats(raw: any): TZadNaDzisStats {
    const result = { ...DEFAULT_STATS };
    if (!raw || typeof raw !== 'object') return result;

    for (const typ of Object.values(TZadNaDzisTyp)) {
      if (raw[typ]) {
        result[typ] = {
          ilosc: raw[typ].ilosc ?? 0,
          wyswDla0: raw[typ].wyswDla0 ?? false,
        };
      }
    }
    return result;
  }

  private getMockData(): TZadNaDzisResponse {
    return {
      stats: {
        [TZadNaDzisTyp.Sprawa]:      { ilosc: 12, wyswDla0: true },
        [TZadNaDzisTyp.Dokument]:    { ilosc: 2, wyswDla0: true },
        [TZadNaDzisTyp.EDorecz]:     { ilosc: 5, wyswDla0: false },
        [TZadNaDzisTyp.DokWyslane]:  { ilosc: 0, wyswDla0: false },
      },
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sOK,
      statusDane: '',
      dozrobienia: [
        {
          numer: 2221481,
          typ: TZadNaDzisTyp.Sprawa,
          skrzynka: TSkrzynki.tss_SSprTermin,
          nazwa: 'PRZETARG',
          znak: 'F.3120.1.2026',
          data: '2026-03-21T00:00:00.000Z',
          dotyczy: 'Softres Sp.z o.o.'
        },
        {
          numer: 2221458,
          typ: TZadNaDzisTyp.Sprawa,
          skrzynka: TSkrzynki.tss_SSprPilne,
          nazwa: 'UMORZENIA',
          znak: 'F.3210.1.2026',
          data: '2026-03-29T00:00:00.000Z',
          dotyczy: ''
        },
        {
          numer: 2229700,
          typ: TZadNaDzisTyp.Dokument,
          skrzynka: TSkrzynki.tps_PBiezace,
          nazwa: 'DECYZJA',
          znak: '28/R-FK/26',
          data: '2026-04-08T00:00:00.000Z',
          dotyczy: ''
        },
        {
          numer: 2237541,
          typ: TZadNaDzisTyp.Dokument,
          skrzynka: TSkrzynki.tps_PBiezace,
          nazwa: 'FAKTURA KSEF 2026/FVS/136872/BS',
          znak: '29/R-FK/26',
          data: '2026-04-03T00:00:00.000Z',
          dotyczy: 'Jan Nowak'
        },
        {
          numer: 2226183,
          typ: TZadNaDzisTyp.EDorecz,
          skrzynka: TSkrzynki.tes_KEleDoreczPrzych,
          nazwa: 'RE: Test 0322',
          znak: 'PPSA-E-df1b35f5-613f-4397-96d3-2ab920bf6b69',
          data: '2026-03-22T11:17:44.447Z',
          dotyczy: ''
        },
        {
          numer: 2221174,
          typ: TZadNaDzisTyp.EDorecz,
          skrzynka: TSkrzynki.tes_KEleDoreczPrzych,
          nazwa: 'Dotyczy kartoteki: 03/2 - Gospodarowanie odpadami',
          znak: 'PPSA-E-7cc7930f-4e17-4296-b09f-0224226565dc',
          data: '2026-02-11T14:15:46.817Z',
          dotyczy: ''
        }
      ]
    };
  }
}
