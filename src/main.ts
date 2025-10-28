import { Component, OnDestroy, HostListener } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { LoginWindowComponent } from './components/login-window.component';
import { InfoWindowComponent } from './components/info-window.component';
import { SkrzynkiTreeComponent } from './components/skrzynki-tree.component';
import { DocumentsGridComponent } from './components/documents-grid.component';
import { DocumentDetailsComponent } from './components/document-details.component';
import { SprawyGridComponent } from './components/sprawy-grid.component';
import { KontrahenciWindowComponent } from './components/kontrahenci-window.component';
import { DocumentEditWindowComponent } from './components/document-edit-window.component';
import { WydzialSelectWindowComponent } from './components/wydzial-select-window.component';
import { Dokument } from './models/dokument.model';
import { SessionData } from './models/session.model';
import { Skrzynka, isSprawySkrzynka } from './models/skrzynka.model';
import { TWydzialInfo } from './models/typy-info.model';
import { Sprawa } from './models/sprawa.model';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginWindowComponent, InfoWindowComponent, SkrzynkiTreeComponent, DocumentsGridComponent, DocumentDetailsComponent, KontrahenciWindowComponent, DocumentEditWindowComponent, WydzialSelectWindowComponent, SprawyGridComponent],
  template: `
    <app-login-window
      *ngIf="!isLoggedIn"
      (loginSuccess)="onLoginSuccess()"
    ></app-login-window>

    <app-wydzial-select-window
      *ngIf="showWydzialSelect"
      [wydzialy]="availableWydzialy"
      (wydzialSelected)="onWydzialSelected($event)"
    ></app-wydzial-select-window>

    <div class="app-container" *ngIf="isLoggedIn && !showWydzialSelect">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div 
            class="menu-trigger"
            (click)="toggleMenu()"
          >
            <span class="menu-icon">☰</span>
            <span class="menu-text">Menu</span>
            
            <div 
              class="dropdown-menu"
              [class.visible]="showMenu"
            >
              <div class="menu-item" (click)="openKontrahenci()">
                <span class="item-icon">👥</span>
                <span class="item-text">Kontrahenci</span>
              </div>
              <div class="menu-item" (click)="openPracownicy()">
                <span class="item-icon">👨‍💼</span>
                <span class="item-text">Pracownicy</span>
              </div>
              <div class="menu-item" (click)="openJednostki()">
                <span class="item-icon">🏢</span>
                <span class="item-text">Jednostki</span>
              </div>
              <div class="menu-item" (click)="openInfo()">
                <span class="item-icon">ℹ️</span>
                <span class="item-text">Informacja</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tree-section">
          <app-skrzynki-tree (skrzynkaSelected)="onSkrzynkaSelected($event)"></app-skrzynki-tree>
        </div>
      </aside>
      
      <main class="main-content">
        <div class="content-header">
          <div class="header-left">
            <h1 class="main-title">System obiegu dokumentów eSOD</h1>
            <p class="subtitle" *ngIf="!selectedSkrzynka">Wybierz skrzynkę z menu po lewej stronie</p>
            <p class="subtitle" *ngIf="selectedSkrzynka">Skrzynka: {{ selectedSkrzynka.nazwa }}</p>
          </div>
          <div class="header-right">
            <div class="user-info">Użytkownik: {{ sessionData?.imie }} {{ sessionData?.nazwisko }}</div>
            <div class="session-timer" [class.warning]="sessionTimeLeft <= 100">
              <span class="timer-icon">⏱</span>
              <span class="timer-text">{{ formatTime(sessionTimeLeft) }}</span>
            </div>
            <button class="logout-button" (click)="logout()" title="Wyloguj">
              <span class="logout-icon">⏻</span>
            </button>
          </div>
        </div>
        
        <div class="content-body" *ngIf="!selectedSkrzynka">
          <div class="welcome-card" >
            <div class="welcome-icon">📋</div>
            <h2>Witaj w systemie zarządzania</h2>
            <p>
              Ta aplikacja pozwala na zarządzanie różnymi typami skrzynek:
              sprawami, korespondencją elektroniczną i dokumentami.
            </p>
            <ul class="feature-list">
              <li>📁 Hierarchiczna struktura skrzynek</li>
              <li>📊 Automatyczne liczniki dokumentów</li>
              <li>🔄 Odświeżanie danych w czasie rzeczywistym</li>
              <li>📱 Responsywny design</li>
            </ul>
          </div>
        </div>
        
        <div class="documents-layout" *ngIf="selectedSkrzynka && !isSprawyView()">
          <div class="documents-grid-section">
            <app-documents-grid
              [selectedSkrzynka]="selectedSkrzynka"
              (documentSelected)="onDocumentSelected($event)"
              (newDocumentRequested)="onNewDocumentRequested()"
              (editDocumentRequested)="onEditDocumentRequested($event)">
            </app-documents-grid>
          </div>

          <div class="document-details-section">
            <app-document-details [document]="selectedDocument"></app-document-details>
          </div>
        </div>

        <div class="sprawy-layout" *ngIf="selectedSkrzynka && isSprawyView()">
          <div class="sprawy-grid-section">
            <app-sprawy-grid
              [selectedSkrzynka]="selectedSkrzynka"
              (sprawaSelected)="onSprawaSelected($event)">
            </app-sprawy-grid>
          </div>

          <div class="sprawy-documents-section">
            <app-documents-grid
              [selectedSkrzynka]="selectedSkrzynka"
              (documentSelected)="onDocumentSelected($event)"
              (newDocumentRequested)="onNewDocumentRequested()"
              (editDocumentRequested)="onEditDocumentRequested($event)">
            </app-documents-grid>
          </div>
        </div>
      </main>
    </div>
    
    <app-kontrahenci-window 
      *ngIf="showKontrahenciWindow"
      (closeRequested)="closeKontrahenciWindow()"
    ></app-kontrahenci-window>
    
    <app-info-window
      *ngIf="showInfoWindow"
      (closeRequested)="closeInfoWindow()"
    ></app-info-window>

    <app-document-edit-window
      *ngIf="showDocumentEditWindow"
      [mode]="documentEditMode"
      [dokument]="editingDocument!"
      (closeRequested)="closeDocumentEditWindow()"
      (documentSaved)="onDocumentSaved()"
    ></app-document-edit-window>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .sidebar {
      width: 320px;
      min-width: 320px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05);
    }

    .sidebar-header {
      position: relative;
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }

    .menu-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .menu-trigger:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .menu-icon {
      font-size: 16px;
      color: #475569;
    }

    .menu-text {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      margin-top: 4px;
    }

    .dropdown-menu.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f1f5f9;
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item:hover {
      background: #f8fafc;
      transform: translateX(4px);
    }

    .menu-item:first-child {
      border-radius: 8px 8px 0 0;
    }

    .menu-item:last-child {
      border-radius: 0 0 8px 8px;
    }

    .item-icon {
      font-size: 18px;
    }

    .item-text {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }

    .tree-section {
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-header {
      padding: 32px 40px;
      background: linear-gradient(135deg, #ffffff, #f8fafc);
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .header-left {
      flex: 1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      padding: 8px 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .session-timer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      padding: 8px 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      min-width: 100px;
    }

    .session-timer.warning {
      background: #fef3c7;
      border-color: #fbbf24;
      color: #92400e;
    }

    .timer-icon {
      font-size: 16px;
    }

    .timer-text {
      font-variant-numeric: tabular-nums;
    }

    .logout-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-button:hover {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }

    .logout-button:active {
      transform: translateY(0);
    }

    .logout-icon {
      font-size: 16px;
    }

    .main-title {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 800;
      color: #1e293b;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin: 0;
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
    }

    .content-body {
      flex: 1;
      padding: 40px;
      overflow-y: auto;
    }

    .documents-layout {
      flex: 1;
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
      padding: 20px 40px 40px 40px;
      overflow: hidden;
    }

    .sprawy-layout {
      flex: 1;
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
      padding: 20px 40px 40px 40px;
      overflow: hidden;
    }

    .sprawy-grid-section {
      min-height: 0;
    }

    .sprawy-documents-section {
      min-height: 0;
    }

    .documents-grid-section {
      min-height: 0;
    }

    .document-details-section {
      min-height: 0;
    }

    .welcome-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }

    .welcome-icon {
      font-size: 64px;
      margin-bottom: 24px;
    }

    .welcome-card h2 {
      margin: 0 0 16px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .welcome-card p {
      margin: 0 0 32px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #64748b;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;
      max-width: 400px;
      margin: 0 auto;
    }

    .feature-list li {
      padding: 12px 0;
      font-size: 15px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }

    .feature-list li:last-child {
      border-bottom: none;
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 280px;
        min-width: 280px;
      }

      .content-header {
        padding: 24px 32px;
      }

      .main-title {
        font-size: 28px;
      }

      .content-body {
        padding: 32px;
      }

      .documents-layout {
        padding: 16px 32px 32px 32px;
        gap: 16px;
      }
    }

    @media (max-width: 768px) {
      .app-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        min-width: unset;
        height: 50vh;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
      }

      .main-content {
        height: 50vh;
      }

      .content-header {
        padding: 20px 24px;
      }

      .main-title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }

      .content-body {
        padding: 24px;
      }

      .documents-layout {
        padding: 12px 24px 24px 24px;
        gap: 12px;
        grid-template-rows: 1fr 1fr;
      }

      .welcome-card {
        padding: 32px 24px;
      }

      .welcome-card h2 {
        font-size: 24px;
      }
    }
  `]
})
export class App {
  selectedSkrzynka: Skrzynka | null = null;
  selectedDocument: Dokument | null = null;
  selectedSprawa: Sprawa | null = null;
  showMenu = false;
  showKontrahenciWindow = false;
  showInfoWindow = false;
  showDocumentEditWindow = false;
  isLoggedIn = false;
  showWydzialSelect = false;
  availableWydzialy: TWydzialInfo[] = [];
  private hideMenuTimeout: any;
  sessionData: SessionData | null = null;
  documentEditMode: 'add' | 'edit' = 'add';
  editingDocument: Dokument | null = null;

  sessionTimeLeft = 1800;
  private sessionTimeoutMinutes = 10;
  private timerInterval: any;

  constructor(private authService: AuthService, private http: HttpClient) {}

  @HostListener('document:click')
  @HostListener('document:keydown')
  resetSessionTimer() {
    if (this.isLoggedIn) {
      this.sessionTimeLeft = this.sessionTimeoutMinutes * 60;
    }
  }

  onSkrzynkaSelected(skrzynka: Skrzynka) {
    this.selectedSkrzynka = skrzynka;
    this.selectedDocument = null;
    this.selectedSprawa = null;
  }

  onSprawaSelected(sprawa: Sprawa) {
    this.selectedSprawa = sprawa;
  }

  isSprawyView(): boolean {
    if (!this.selectedSkrzynka) {
      return false;
    }
    return isSprawySkrzynka(this.selectedSkrzynka.numer);
  }

  onDocumentSelected(document: Dokument) {
    this.selectedDocument = document;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  openKontrahenci() {
    this.showKontrahenciWindow = true;
    this.showMenu = false;
    this.showMenu = false;
  }

  openPracownicy() {
    // TODO: Implement pracownicy window
    console.log('Opening Pracownicy...');
    this.showMenu = false;
    this.showMenu = false;
  }

  openJednostki() {
    // TODO: Implement jednostki window
    console.log('Opening Jednostki...');
    this.showMenu = false;
    this.showMenu = false;
  }

  closeKontrahenciWindow() {
    this.showKontrahenciWindow = false;
  }

  openInfo() {
    this.showInfoWindow = true;
    this.showMenu = false;
    this.showMenu = false;
  }

  closeInfoWindow() {
    this.showInfoWindow = false;
  }

  onLoginSuccess() {
    this.sessionData = this.authService.getCurrentSession();

    if (this.sessionData && this.sessionData.jednostki && this.sessionData.jednostki.length > 0) {
      this.availableWydzialy = this.sessionData.jednostki;
      this.showWydzialSelect = true;
    } else {
      this.isLoggedIn = true;
      this.sessionTimeLeft = this.sessionTimeoutMinutes * 60;
      this.startSessionTimer();
    }
  }

  hideMenuDelayed() {
    this.hideMenuTimeout = setTimeout(() => {
      this.showMenu = false;
    }, 300);
  }

  cancelHideMenu() {
    if (this.hideMenuTimeout) {
      clearTimeout(this.hideMenuTimeout);
      this.hideMenuTimeout = null;
    }
  }

  onNewDocumentRequested() {
    this.documentEditMode = 'add';
    this.editingDocument = this.createEmptyDokument();
    this.showDocumentEditWindow = true;
  }

  onEditDocumentRequested(dokument: Dokument) {
    this.documentEditMode = 'edit';
    this.editingDocument = { ...dokument };
    this.showDocumentEditWindow = true;
  }

  closeDocumentEditWindow() {
    this.showDocumentEditWindow = false;
    this.editingDocument = null;
  }

  onDocumentSaved() {
    this.showDocumentEditWindow = false;
    this.editingDocument = null;
  }

  private createEmptyDokument(): Dokument {
    return {
      numer: 0,
      archiwum: false,
      dokGlowny: 0,
      wersja: '',
      aktualny: true,
      statusEdycji: '',
      doWgladu: false,
      typ: { nazwa: '', finansowy: false, poleceniezaplaty: false },
      szablon: null,
      nazwa: '',
      opis: '',
      sprawa: null,
      rejestr: '',
      rejestrNumer: 0,
      rejestrRok: 0,
      rejestrNrPozycji: '',
      dataWplywu: '',
      godzinaWplywu: 0,
      numerNaDok: '',
      dataNaDok: '',
      kanalWe: '',
      domKanalWy: '',
      kontrahent: { numer: 0, identyfikator: '', firma: false, nip: '', adres: null },
      przekazujacy: { numer: 0, identyfikator: '' },
      przekazujacyWydzial: { stanowisko: false, symbol: '', nazwa: '', kod: '' },
      dataPrzekazania: '',
      prowadzacy: { numer: 0, identyfikator: '' },
      prowadzacyWydzial: { stanowisko: false, symbol: '', nazwa: '', kod: '' },
      odpowiedzialny: { numer: 0, identyfikator: '' },
      dataPrzyjecia: '',
      uprawPoziom: '',
      statusPrzek: '',
      dataAlert: '',
      dataPlan: '',
      daneFinansowe: null,
      grupa1: '',
      grupa2: '',
      grupa3: '',
      publiczny: false,
      dokGuid: '',
      jrwa: '',
      obcyNumer: '',
      zalaczniki: [],
      oper: '',
      status: '',
      statusDane: ''
    };
  }

  startSessionTimer() {
    this.timerInterval = setInterval(() => {
      if (this.sessionTimeLeft > 0) {
        this.sessionTimeLeft--;
      } else {
        this.logout();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  logout() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.http.get(`${environment.apiBaseUrl}/logout`).subscribe({
      next: () => {
        this.resetApplicationState();
      },
      error: () => {
        this.resetApplicationState();
      }
    });
  }

  onWydzialSelected(wydzial: TWydzialInfo) {
    if (this.sessionData) {
      this.sessionData.jednostkaAkt = wydzial;
    }
    this.showWydzialSelect = false;
    this.isLoggedIn = true;
    this.sessionTimeLeft = this.sessionTimeoutMinutes * 60;
    this.startSessionTimer();
  }

  resetApplicationState() {
    this.isLoggedIn = false;
    this.sessionData = null;
    this.selectedSkrzynka = null;
    this.selectedDocument = null;
    this.showMenu = false;
    this.showKontrahenciWindow = false;
    this.showInfoWindow = false;
    this.showDocumentEditWindow = false;
    this.showWydzialSelect = false;
    this.availableWydzialy = [];
    this.editingDocument = null;
    this.sessionTimeLeft = this.sessionTimeoutMinutes * 60;
    this.authService.clearSession();
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));