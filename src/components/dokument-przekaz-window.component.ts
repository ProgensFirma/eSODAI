import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JednostkiService } from '../services/jednostki.service';
import { PracownicyService } from '../services/pracownicy.service';
import { DokumentPrzekazService } from '../services/dokument-przekaz.service';
import { ParametryService } from '../services/parametry.service';
import { TJednostka, TOsobaInfo } from '../models/typy-info.model';

@Component({
  selector: 'app-dokument-przekaz-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="window-overlay" (click)="onOverlayClick($event)">
      <div class="window-container" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">Przekaż dokument</h2>
          <button class="close-button" (click)="close()" title="Zamknij">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="window-content">
          <div class="form-group">
            <label class="form-label">Jednostka:</label>
            <select
              class="form-select"
              [(ngModel)]="selectedJednostka"
              (ngModelChange)="onJednostkaChange()"
            >
              <option [ngValue]="null">-- Wybierz jednostkę --</option>
              <option *ngFor="let jednostka of jednostki" [ngValue]="jednostka">
                {{ jednostka.symbol }} - {{ jednostka.nazwa }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Pracownik:</label>
            <select
              class="form-select"
              [(ngModel)]="selectedOsoba"
              [disabled]="!selectedJednostka || loadingPracownicy || przekazDoWydzialu"
            >
              <option [ngValue]="null">-- Wybierz pracownika --</option>
              <option *ngFor="let osoba of pracownicy" [ngValue]="osoba">
                {{ osoba.identyfikator }}
              </option>
            </select>
          </div>

          <div class="form-group checkbox-group" [style.visibility]="pokazCheckWydzialu ? 'visible' : 'hidden'">
            <label class="checkbox-label">
              <input
                type="checkbox"
                class="checkbox-input"
                [(ngModel)]="przekazDoWydzialu"
                (ngModelChange)="onPrzekazDoWydzialu()"
              />
              <span class="checkbox-text">Przekaż do wydziału</span>
            </label>
          </div>

          <div class="loading-message" *ngIf="loadingPracownicy">
            Ładowanie pracowników...
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>
        </div>

        <div class="window-footer">
          <button
            class="action-button button-save"
            (click)="onPrzekaz()"
            [disabled]="!canPrzekaz() || submitting"
          >
            <span class="button-icon">✓</span>
            Przekaż
          </button>
          <button class="action-button button-cancel" (click)="close()">
            <span class="button-icon">✗</span>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .window-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(2px);
    }

    .window-container {
      background: var(--bg-surface);
      border-radius: 16px;
      box-shadow: 0 20px 60px var(--shadow-md);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
      transition: var(--transition-theme);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 1px solid var(--border-default);
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
    }

    .window-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .close-button {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: var(--bg-muted);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 24px;
      font-weight: 300;
    }

    .close-button:hover {
      background: var(--border-default);
      color: var(--text-primary);
      transform: scale(1.1);
    }

    .close-icon {
      line-height: 1;
    }

    .window-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--input-border);
      border-radius: 8px;
      font-size: 14px;
      color: var(--input-text);
      background: var(--input-bg);
      transition: all 0.2s ease;
    }

    .form-select:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .form-select:disabled {
      background: var(--bg-muted);
      color: var(--text-faint);
      cursor: not-allowed;
    }

    .checkbox-group {
      margin-bottom: 16px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #2563eb;
    }

    .checkbox-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .loading-message {
      padding: 12px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      color: #1e40af;
      font-size: 14px;
      text-align: center;
      margin-top: 16px;
    }

    .error-message {
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #991b1b;
      font-size: 14px;
      margin-top: 16px;
    }

    .success-message {
      padding: 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #166534;
      font-size: 14px;
      margin-top: 16px;
    }

    .window-footer {
      padding: 24px 32px;
      border-top: 1px solid var(--border-default);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      background: var(--bg-subtle);
    }

    .action-button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .button-save {
      background: #16a34a;
      color: white;
    }

    .button-save:hover:not(:disabled) {
      background: #15803d;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
    }

    .button-save:disabled {
      background: var(--border-muted);
      color: var(--text-faint);
      cursor: not-allowed;
    }

    .button-cancel {
      background: var(--bg-muted);
      color: var(--text-secondary);
    }

    .button-cancel:hover {
      background: var(--border-default);
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .window-container {
        width: 95%;
        max-height: 95vh;
      }

      .window-header {
        padding: 20px 24px;
      }

      .window-title {
        font-size: 20px;
      }

      .window-content {
        padding: 24px;
      }

      .window-footer {
        padding: 20px 24px;
        flex-direction: column-reverse;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DokumentPrzekazWindowComponent implements OnInit {
  @Input() dokumentNumer!: number;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() dokumentPrzekazany = new EventEmitter<void>();

  jednostki: TJednostka[] = [];
  pracownicy: TOsobaInfo[] = [];
  selectedJednostka: TJednostka | null = null;
  selectedOsoba: TOsobaInfo | null = null;
  loadingPracownicy = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  przekazDoWydzialu = false;
  pokazCheckWydzialu = false;

  private readonly OSOBA_WYDZIALU = 1410;

  constructor(
    private jednostkiService: JednostkiService,
    private pracownicyService: PracownicyService,
    private dokumentPrzekazService: DokumentPrzekazService,
    private parametryService: ParametryService
  ) {}

  ngOnInit() {
    this.loadJednostki();
    this.checkParamWydzialu();
  }

  private checkParamWydzialu() {
    this.parametryService.getParametr('PAR_SKR_DOK_WYDZIALU').subscribe({
      next: (parametr) => {
        this.pokazCheckWydzialu = parametr.wartosc.toLowerCase() === 'true';
      },
      error: () => {
        this.pokazCheckWydzialu = false;
      }
    });
  }

  loadJednostki() {
    this.jednostkiService.getJednostki().subscribe({
      next: (jednostki) => {
        this.jednostki = jednostki;
      },
      error: (error) => {
        console.error('Error loading jednostki:', error);
        this.errorMessage = 'Błąd podczas ładowania jednostek';
      }
    });
  }

  onJednostkaChange() {
    this.selectedOsoba = null;
    this.pracownicy = [];
    this.errorMessage = '';

    if (this.selectedJednostka && !this.przekazDoWydzialu) {
      this.loadingPracownicy = true;
      this.pracownicyService.getPracownicyJednostki(this.selectedJednostka.symbol).subscribe({
        next: (pracownicy) => {
          this.pracownicy = pracownicy;
          this.loadingPracownicy = false;
        },
        error: (error) => {
          console.error('Error loading pracownicy jednostki:', error);
          this.errorMessage = 'Błąd podczas ładowania pracowników jednostki';
          this.loadingPracownicy = false;
        }
      });
    }
  }

  onPrzekazDoWydzialu() {
    this.selectedOsoba = null;
    this.errorMessage = '';
    if (!this.przekazDoWydzialu && this.selectedJednostka) {
      this.onJednostkaChange();
    }
  }

  canPrzekaz(): boolean {
    if (!this.selectedJednostka) return false;
    if (this.przekazDoWydzialu) return true;
    return this.selectedOsoba !== null;
  }

  onPrzekaz() {
    if (!this.canPrzekaz()) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {
      Dokument: this.dokumentNumer,
      Jednostka: this.selectedJednostka!.symbol,
      Osoba: this.przekazDoWydzialu ? this.OSOBA_WYDZIALU : this.selectedOsoba!.numer
    };

    this.dokumentPrzekazService.przekazDokument(request).subscribe({
      next: () => {
        this.successMessage = 'Dokument przekazany';
        this.submitting = false;
        setTimeout(() => {
          this.dokumentPrzekazany.emit();
          this.close();
        }, 1500);
      },
      error: (error) => {
        console.error('Error przekazywania dokumentu:', error);
        this.errorMessage = 'Błąd podczas przekazywania dokumentu';
        this.submitting = false;
      }
    });
  }

  onOverlayClick(event: MouseEvent) {
    this.close();
  }

  close() {
    this.closeRequested.emit();
  }
}
