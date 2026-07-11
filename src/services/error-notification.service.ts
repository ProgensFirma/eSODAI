import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ErrorNotification {
  message: string;
  details?: string;
  blad?: string;
  opis?: string;
  serwis?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  private errorSubject = new Subject<ErrorNotification>();

  error$ = this.errorSubject.asObservable();

  showError(message: string, details?: string, apiError?: { blad?: string; opis?: string; serwis?: string }) {
    this.errorSubject.next({ message, details, ...apiError });
  }
}
