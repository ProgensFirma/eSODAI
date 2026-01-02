import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Parametr } from '../models/parametr.model';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { TBazaOper, TeSodStatus, TSODParamTyp } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class ParametryService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/parametry`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getParametry(): Observable<Parametr[]> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja || 123;

    const params = new HttpParams()
      .append('sesja', sesjaId.toString());

    return this.http.get<Parametr[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching parametry:', error);
        return of(this.getMockData());
      })
    );
  }

  private getMockData(): Parametr[] {
    return [
      {
        parametr: 'PAR_BANKRACH_GEO',
        grupa: 'ADMPUB',
        kolejnosc: 75,
        opis: 'Konto wpłat geodezji',
        wartosc: '61 2091 6800 0499 9800 1100 0059',
        typ: TSODParamTyp.ptString,
        pomoc: 'Konto wpłat geodezji dla usług geodezyjnych',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_DWA_ZNAKI',
        grupa: 'ADMPUB',
        kolejnosc: 8,
        opis: 'Dwa sposoby numeracji spraw',
        wartosc: 'True',
        typ: TSODParamTyp.ptBoolean,
        pomoc: 'Możliwość nadawania znaku sprawy na dwa różne sposoby.',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_ePUAP_CZASSPR',
        grupa: 'ADMPUB',
        kolejnosc: 45,
        opis: 'Spr. nowych dok. ePUAP co [min]',
        wartosc: '30',
        typ: TSODParamTyp.ptInteger,
        pomoc: 'Sprawdzanie nowych dokumentów ePUAP co podaną liczbę minut. Sprawdzana jest domyślna konfiguracja użytkownika jeżeli w pliku ini ma ustawioną wartość [USTAWIENIA]SprDokePUAP=1',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_ePUAP_DNIDOPOTW',
        grupa: 'ADMPUB',
        kolejnosc: 31,
        opis: 'Ilość dni do potwierdzenia',
        wartosc: '14',
        typ: TSODParamTyp.ptInteger,
        pomoc: 'Domyślna ilość dni na potwierdzenie dostarczenia dokumentu przez platformę ePUAP',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_LIMIT_POBIERANIA',
        grupa: 'SYSTEM',
        kolejnosc: 10,
        opis: 'Limit pobieranych rekordów',
        wartosc: '1000',
        typ: TSODParamTyp.ptInteger,
        pomoc: 'Maksymalna liczba rekordów pobieranych z bazy danych w jednym zapytaniu',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_BACKUP_AUTO',
        grupa: 'SYSTEM',
        kolejnosc: 20,
        opis: 'Automatyczne kopie zapasowe',
        wartosc: 'True',
        typ: TSODParamTyp.ptBoolean,
        pomoc: 'Włącz automatyczne tworzenie kopii zapasowych bazy danych',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_SESJA_TIMEOUT',
        grupa: 'SYSTEM',
        kolejnosc: 5,
        opis: 'Czas trwania sesji [min]',
        wartosc: '30',
        typ: TSODParamTyp.ptInteger,
        pomoc: 'Maksymalny czas trwania sesji użytkownika w minutach',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_EMAIL_NOTYFIKACJE',
        grupa: 'POWIADOMIENIA',
        kolejnosc: 1,
        opis: 'Powiadomienia e-mail',
        wartosc: 'True',
        typ: TSODParamTyp.ptBoolean,
        pomoc: 'Włącz wysyłanie powiadomień e-mail o nowych dokumentach',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_EMAIL_SERWER',
        grupa: 'POWIADOMIENIA',
        kolejnosc: 2,
        opis: 'Adres serwera SMTP',
        wartosc: 'smtp.example.com',
        typ: TSODParamTyp.ptString,
        pomoc: 'Adres serwera SMTP do wysyłania powiadomień e-mail',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_MAX_ZALACZNIK',
        grupa: 'DOKUMENTY',
        kolejnosc: 1,
        opis: 'Maks. rozmiar załącznika [MB]',
        wartosc: '25.5',
        typ: TSODParamTyp.ptNumeric,
        pomoc: 'Maksymalny rozmiar pojedynczego załącznika w megabajtach',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      },
      {
        parametr: 'PAR_ARCHIWIZACJA_AUTO',
        grupa: 'DOKUMENTY',
        kolejnosc: 10,
        opis: 'Automatyczna archiwizacja',
        wartosc: 'False',
        typ: TSODParamTyp.ptBoolean,
        pomoc: 'Automatyczna archiwizacja dokumentów starszych niż określony czas',
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sOK,
        statusDane: ''
      }
    ];
  }
}
