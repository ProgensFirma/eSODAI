import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

export interface LicencjaResponse {
  Licencja: string;
}

@Injectable({
  providedIn: 'root'
})
export class LicencjaService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  getLicencja(): Observable<LicencjaResponse> {
    const sessionData = this.authService.getCurrentSession();
    const sesja = sessionData?.sesja || '';
    return this.http.get<LicencjaResponse>(`${this.configService.apiBaseUrl}/licencja`, {
      params: { sesja }
    });
  }
}
