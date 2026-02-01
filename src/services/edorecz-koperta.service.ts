import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { EdoreczPunktNadawczy } from '../models/edorecz-punkt-nadawczy.model';

@Injectable({
  providedIn: 'root'
})
export class EdoreczKopertaService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getPunktyNadawcze(): Observable<EdoreczPunktNadawczy[]> {
    const apiUrl = this.configService.apiBaseUrl;
    return this.http.get<EdoreczPunktNadawczy[]>(`${apiUrl}/eDorecz/PunktyNadawcze`);
  }
}
