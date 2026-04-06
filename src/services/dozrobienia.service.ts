import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { DoZrobieniaResponse } from '../models/dozrobienia.model';

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
    });
  }
}
