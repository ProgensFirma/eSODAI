import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
//import { SignerService } from 'signer-ui';

@Injectable({
  providedIn: 'root'
})
export class DokumentPodpiszService {

  private get apiUrl(): string {
    return `${this.configService.apiBaseUrl}/dokument/podpisz`;
  }

  constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

  podpiszDokument(dokument: number, tylkoOznacz: boolean = false, pieczec: boolean = false, zalacznik?: number): Observable<any> {
    const session = this.authService.getCurrentSession();
    const sesjaId = session?.sesja;
    if (!sesjaId) return throwError(() => new Error('Brak sesji'));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().append('sesja', sesjaId.toString());

    const body: any = { dokument };
    if (tylkoOznacz) {
      body.tylkoOznacz = true;
    }
    if (pieczec) {
      body.pieczec = true;
    }
    if (zalacznik !== undefined) {
      body.zalacznik = zalacznik;
    }

    return this.http.post(this.apiUrl, body, { headers, params });
  }
}

export function base64ToFile(base64: string, fileName: string, mimeType = 'application/pdf'): File {
  // Usunięcie ewentualnego prefiksu:
  // data:application/pdf;base64,...
  const base64Data = base64.includes(',')
    ? base64.split(',')[1]
    : base64;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new File([byteArray], fileName, {
    type: mimeType,
  });
}
