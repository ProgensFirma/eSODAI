import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TDokWyjRodzajWysylki } from '../models/dok-wyj-rodzaj-wysylki.model';
import { TBazaOper, TeSodStatus, TKanalTyp } from '../models/enums.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DokWyjRodzajWysylkiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getRodzaje(): Observable<TDokWyjRodzajWysylki[]> {
    const session = this.authService.getCurrentSession();
    const params = new HttpParams().set('sesja', session?.sesja?.toString() || '');

    return this.http.get<TDokWyjRodzajWysylki[]>(
      `${this.configService.apiBaseUrl}/dokWyjscia/slowRodzWysylki`,
      { params }
    ).pipe(
      catchError(() => {
        if (!environment.production) {
          return of(this.getMockData());
        }
        return of([]);
      })
    );
  }

  private getMockData(): TDokWyjRodzajWysylki[] {
    return [
      { nazwa: 'eDoręczenia', kanalWy: TKanalTyp.tk_eDorecz,   oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'Email',       kanalWy: TKanalTyp.tk_email,      oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'ePUAP',       kanalWy: TKanalTyp.tk_brak,       oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'Fax',         kanalWy: TKanalTyp.tk_brak,       oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'Goniec',      kanalWy: TKanalTyp.tk_papierowy,  oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'Polecony',    kanalWy: TKanalTyp.tk_papierowy,  oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
      { nazwa: 'Zwykły',      kanalWy: TKanalTyp.tk_papierowy,  oper: TBazaOper.tboSelect, status: TeSodStatus.sBrak, statusDane: '' },
    ];
  }
}
