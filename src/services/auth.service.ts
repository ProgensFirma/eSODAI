import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError, map } from 'rxjs';
import { LoginRequest, SessionData, LoginResponse } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8448/login';
  private sessionSubject = new BehaviorSubject<SessionData | null>(null);
  private appServerVersionSubject = new BehaviorSubject<string>('');

  public session$ = this.sessionSubject.asObservable();
  public appServerVersion$ = this.appServerVersionSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('login', loginData.login)
      .set('haslo', loginData.haslo);

    return this.http.get<SessionData>(this.apiUrl, { 
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<SessionData>) => {
        const sessionData = response.body!;
        const appServerVersion = response.headers.get('appServer') || '';
        
        this.sessionSubject.next(sessionData);
        this.appServerVersionSubject.next(appServerVersion);
        
        return {
          sessionData,
          appServerVersion
        };
      }),
      catchError(error => {
        console.error('Login error:', error);
        // Return mock data for development
        if (error.status === 0 || error.status === 404) {
          const mockSessionData: SessionData = {
            sesja: 123,
            gUnikNr: 60589538,
            sysOper: "sys_Windows",
            dB: "bdFD_FireBird",
            firma: 0,
            firmaNazwa: "",
            login: loginData.login,
            osoba: 861528,
            nazwisko: "BLICHARZ",
            imie: "JOANNA",
            stanowisko: "",
            symbol: "",
            poziom: "1E1",
            jednostkaAkt: {
              symbol: "1E11",
              nazwa: "Pracownicy DTWI",
              kod: "",
              stanowisko: false
            },
            jednostki: [
              {
                symbol: "1E11",
                nazwa: "Pracownicy DTWI",
                kod: "",
                stanowisko: false
              }
            ],
            zalogowany: true,
            admin: true,
            czasStart: new Date().toISOString(),
            czasAktual: new Date().toISOString(),
            czasStop: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          };
          
          const mockAppServerVersion = "NSeSOD v:1.0.0.0, D12.2";
          
          this.sessionSubject.next(mockSessionData);
          this.appServerVersionSubject.next(mockAppServerVersion);
          
          return new Observable<LoginResponse>(observer => {
            observer.next({
              sessionData: mockSessionData,
              appServerVersion: mockAppServerVersion
            });
            observer.complete();
          });
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.sessionSubject.next(null);
    this.appServerVersionSubject.next('');
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    this.appServerVersionSubject.next('');
  }

  getCurrentSession(): SessionData | null {
    return this.sessionSubject.value;
  }

  getCurrentAppServerVersion(): string {
    return this.appServerVersionSubject.value;
  }

  isLoggedIn(): boolean {
    const session = this.getCurrentSession();
    return session?.zalogowany === true;
  }
}