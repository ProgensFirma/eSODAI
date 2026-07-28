import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ustawienia } from '../models/ustawienia.model';
import { TeSodStatus } from '../models/enums.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { ErrorNotificationService } from './error-notification.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UstawieniaService {
  private useMockData = true;

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/ustawienia`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private errorService: ErrorNotificationService
  ) {}

  getUstawienia(): Observable<Ustawienia> {
    if (this.useMockData) {
      return of(this.getMockUstawienia());
    }

    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const params = new HttpParams().append('sesja', sesjaId.toString());

    return this.http.get<Ustawienia>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching ustawienia:', error);

        if (!environment.production) {
          return of(this.getMockUstawienia());
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private getMockUstawienia(): Ustawienia {
    return {
      pieczecObsluga: true,
      podpisObsluga: false,
      powiadomieniaObsluga: true,
      eDoreczObsluga: true,
      kSeFObsluga: false,
      jednPrzekObsluga: false,
      maxRozmiarPliku: 50,
      dokumentSpecUpraw: false,
      sprawaZamkDolaczPismo: true,
      status: TeSodStatus.sOK,
      statusDane: ''
    };
  }
}
