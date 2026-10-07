import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JednostkiService } from '../services/jednostki.service';
import { PracownicyService } from '../services/pracownicy.service';
import { DokumentDekretujService } from '../services/dokument-dekretuj.service';
import { DokumentPrzekazService, DokumentPrzekazRequest } from '../services/dokument-przekaz.service';
import { AuthService } from '../services/auth.service';
import { TJednostka, TOsobaInfo, TWydzialInfo } from '../models/typy-info.model';
import { TDekretacja } from '../models/dekretacja.model';
import { Dokument } from '../models/dokument.model';

interface InnaDekretacjaRow {
  komPrzyj: TJednostka | null;
  osobaPrzyj: TOsobaInfo | null;
  innaDoWgladu: boolean;
  pracownicy: TOsobaInfo[];
  loading: boolean;
}

@Component({
  selector: 'app-dekretacja-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="window-overlay" (click)="close()">
      <div class="window-container" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">Dekretacja</h2>
          <button class="close-button" (click)="close()" title="Zamknij">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="window-content">
          <div class="dokument-info">
            <div class="info-row">
              <span class="info-label">Nr rejestru:</span>
              <span class="info-value">{{ dokument.rejestrNrPozycji || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data wpływu:</span>
              <span class="info-value">{{ formatDate(dokument.dataCzasWplywu) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Kontrahent:</span>
              <span class="info-value">{{ dokument.kontrahent.identyfikator || '-' }}</span>
            </div>
          </div>

          <div class="section-title">Główna dekretacja</div>

          <div class="form-group">
            <label class="form-label">Komórka:</label>
            <select
              class="form-select"
              [(ngModel)]="selectedJednostka"
              (ngModelChange)="onJednostkaChange()"
            >
              <option [ngValue]="null">-- Wybierz komórkę --</option>
              <option *ngFor="let j of jednostki" [ngValue]="j">
                {{ j.symbol }} - {{ j.nazwa }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Osoba w komórce:</label>
            <select
              class="form-select"
              [(ngModel)]="selectedOsoba"
              [disabled]="!selectedJednostka || loadingPracownicy"
            >
              <option [ngValue]="null">-- Wybierz osobę --</option>
              <option *ngFor="let os of pracownicy" [ngValue]="os">
                {{ os.identyfikator }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Uwagi:</label>
            <textarea
              class="form-textarea"
              [(ngModel)]="uwagi"
              rows="3"
              placeholder="Wpisz uwagi..."
            ></textarea>
          </div>

          <div class="form-group form-group-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox-input" [(ngModel)]="przekazWgDekretacji" />
              <span>Przekaz wg dekretacji</span>
            </label>
          </div>

          <div class="section-title">Inne dekretacje</div>

          <div class="inne-table">
            <div class="inne-header">
              <div class="inne-col-kom">Komórka</div>
              <div class="inne-col-os">Osoba</div>
              <div class="inne-col-wgl">Do wglądu</div>
              <div class="inne-col-act"></div>
            </div>

            <div *ngFor="let row of inneDekretacje; let i = index" class="inne-row">
              <div class="inne-col-kom">
                <select
                  class="form-select form-select-sm"
                  [(ngModel)]="row.komPrzyj"
                  (ngModelChange)="onInnaJednostkaChange(i)"
                >
                  <option [ngValue]="null">-- wybierz --</option>
                  <option *ngFor="let j of jednostki" [ngValue]="j">
                    {{ j.symbol }}
                  </option>
                </select>
              </div>
              <div class="inne-col-os">
                <select
                  class="form-select form-select-sm"
                  [(ngModel)]="row.osobaPrzyj"
                  [disabled]="!row.komPrzyj || row.loading"
                >
                  <option [ngValue]="null">-- wybierz --</option>
                  <option *ngFor="let os of row.pracownicy" [ngValue]="os">
                    {{ os.identyfikator }}
                  </option>
                </select>
              </div>
              <div class="inne-col-wgl">
                <input type="checkbox" class="checkbox-input" [(ngModel)]="row.innaDoWgladu" />
              </div>
              <div class="inne-col-act">
                <button class="inne-remove-btn" (click)="removeInna(i)" title="Usuń">×</button>
              </div>
            </div>

            <div class="inne-empty" *ngIf="inneDekretacje.length === 0">
              Brak dodatkowych dekretacji
            </div>
          </div>

          <button class="add-inne-btn" (click)="addInna()">
            <span class="add-icon">+</span> Dodaj dekretację
          </button>

          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
          <div class="success-message" *ngIf="successMessage">{{ successMessage }}</div>
        </div>

        <div class="window-footer">
          <button
            class="action-button button-save"
            (click)="onDekretuj()"
            [disabled]="!canDekretuj() || submitting"
          >
            <span class="button-icon">✓</span>
            {{ submitting ? 'Dekretowanie...' : 'Dekretuj' }}
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
      top: 0; left: 0; right: 0; bottom: 0;
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
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
      transition: var(--transition-theme);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 28px;
      border-bottom: 1px solid var(--border-default);
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
    }

    .window-title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .close-button {
      width: 32px; height: 32px;
      border-radius: 8px;
      border: none;
      background: var(--bg-muted);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 22px;
      font-weight: 300;
    }

    .close-button:hover {
      background: var(--border-default);
      color: var(--text-primary);
      transform: scale(1.1);
    }

    .window-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
    }

    .dokument-info {
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }

    .info-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 14px;
    }

    .info-row:last-child { margin-bottom: 0; }

    .info-label {
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 110px;
    }

    .info-value {
      color: var(--text-primary);
    }

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--border-default);
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-select {
      width: 100%;
      padding: 10px 14px;
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

    .form-select-sm {
      padding: 7px 10px;
      font-size: 13px;
    }

    .form-textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--input-border);
      border-radius: 8px;
      font-size: 14px;
      color: var(--input-text);
      background: var(--input-bg);
      resize: vertical;
      font-family: inherit;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .inne-table {
      border: 1px solid var(--border-default);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .inne-header {
      display: flex;
      background: var(--bg-subtle);
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .inne-row {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-top: 1px solid var(--border-default);
    }

    .inne-col-kom { flex: 0 0 35%; padding-right: 8px; }
    .inne-col-os { flex: 1; padding-right: 8px; }
    .inne-col-wgl { flex: 0 0 80px; text-align: center; }
    .inne-col-act { flex: 0 0 32px; text-align: center; }

    .checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #2563eb;
    }

    .inne-remove-btn {
      width: 26px; height: 26px;
      border: none;
      border-radius: 6px;
      background: var(--bg-muted);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 18px;
      font-weight: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .inne-remove-btn:hover {
      background: #fef2f2;
      color: #991b1b;
    }

    .inne-empty {
      padding: 16px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }

    .add-inne-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px dashed var(--border-default);
      border-radius: 8px;
      background: transparent;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 16px;
    }

    .add-inne-btn:hover {
      border-color: #2563eb;
      color: #2563eb;
      background: #eff6ff;
    }

    .form-group-checkbox {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-primary);
      cursor: pointer;
      user-select: none;
    }

    .add-icon {
      font-size: 18px;
      font-weight: 300;
    }

    .error-message {
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #991b1b;
      font-size: 14px;
    }

    .success-message {
      padding: 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #166534;
      font-size: 14px;
    }

    .window-footer {
      padding: 20px 28px;
      border-top: 1px solid var(--border-default);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      background: var(--bg-subtle);
    }

    .action-button {
      padding: 10px 22px;
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

      .window-header { padding: 16px 20px; }
      .window-title { font-size: 18px; }
      .window-content { padding: 20px; }
      .window-footer { padding: 16px 20px; flex-direction: column-reverse; }
      .action-button { width: 100%; justify-content: center; }

      .inne-col-kom { flex: 0 0 30%; }
      .inne-col-os { flex: 1; }
      .inne-col-wgl { flex: 0 0 60px; }
    }
  `]
})
export class DekretacjaWindowComponent implements OnInit {
  @Input() dokument!: Dokument;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() dokumentDekretowany = new EventEmitter<void>();

  jednostki: TJednostka[] = [];
  pracownicy: TOsobaInfo[] = [];
  selectedJednostka: TJednostka | null = null;
  selectedOsoba: TOsobaInfo | null = null;
  loadingPracownicy = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  uwagi = '';
  przekazWgDekretacji = false;

  inneDekretacje: InnaDekretacjaRow[] = [];

  constructor(
    private jednostkiService: JednostkiService,
    private pracownicyService: PracownicyService,
    private dekretujService: DokumentDekretujService,
    private dokumentPrzekazService: DokumentPrzekazService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadJednostki();
  }

  private loadJednostki() {
    this.jednostkiService.getJednostki().subscribe({
      next: (list) => { this.jednostki = list; },
      error: (err) => {
        console.error('Error loading jednostki:', err);
        this.errorMessage = 'Błąd podczas ładowania komórek';
      }
    });
  }

  onJednostkaChange() {
    this.selectedOsoba = null;
    this.pracownicy = [];
    this.errorMessage = '';

    if (this.selectedJednostka) {
      this.loadingPracownicy = true;
      this.pracownicyService.getPracownicyJednostki(this.selectedJednostka.symbol).subscribe({
        next: (list) => { this.pracownicy = list; this.loadingPracownicy = false; },
        error: (err) => {
          console.error('Error loading pracownicy:', err);
          this.errorMessage = 'Błąd podczas ładowania osób';
          this.loadingPracownicy = false;
        }
      });
    }
  }

  addInna() {
    this.inneDekretacje.push({
      komPrzyj: null,
      osobaPrzyj: null,
      innaDoWgladu: false,
      pracownicy: [],
      loading: false
    });
  }

  removeInna(index: number) {
    this.inneDekretacje.splice(index, 1);
  }

  onInnaJednostkaChange(index: number) {
    const row = this.inneDekretacje[index];
    row.osobaPrzyj = null;
    row.pracownicy = [];

    if (row.komPrzyj) {
      row.loading = true;
      this.pracownicyService.getPracownicyJednostki(row.komPrzyj.symbol).subscribe({
        next: (list) => { row.pracownicy = list; row.loading = false; },
        error: (err) => {
          console.error('Error loading pracownicy for inne:', err);
          row.loading = false;
        }
      });
    }
  }

  private wydzialToInfo(j: TJednostka): TWydzialInfo {
    return {
      stanowisko: j.stanowisko,
      symbol: j.symbol,
      nazwa: j.nazwa,
      kod: j.kod
    };
  }

  canDekretuj(): boolean {
    if (!this.selectedJednostka || !this.selectedOsoba) return false;
    return true;
  }

  formatDate(dateString?: string): string {
    if (!dateString || dateString === '1899-12-30T00:00:00.000Z') return '-';
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  }

  onDekretuj() {
    if (!this.canDekretuj() || !this.dokument) return;

    this.errorMessage = '';
    this.successMessage = '';

    const session = this.authService.getCurrentSession();
    if (!session) {
      this.errorMessage = 'Brak sesji';
      return;
    }

    const dekretowal: TOsobaInfo = {
      numer: session.osoba,
      identyfikator: `${session.imie} ${session.nazwisko}`.trim() || session.login
    };

    const dokInfo = {
      numer: this.dokument.numer,
      typ: this.dokument.typ,
      nazwa: this.dokument.nazwa,
      rejestrNrPozycji: this.dokument.rejestrNrPozycji,
      kontrahent: this.dokument.kontrahent ?? null
    };

    const inneRows = this.inneDekretacje
      .filter(r => r.komPrzyj && r.osobaPrzyj)
      .map(r => ({
        numer: 0,
        dokument: null,
        komPrzyj: this.wydzialToInfo(r.komPrzyj!),
        osobaPrzyj: r.osobaPrzyj!,
        dekretowal: null,
        uwagi: '',
        innaDoWgladu: r.innaDoWgladu,
        inne: null
      }));

    const dekretacja: TDekretacja = {
      numer: 0,
      dokument: dokInfo,
      komPrzyj: this.wydzialToInfo(this.selectedJednostka!),
      osobaPrzyj: this.selectedOsoba!,
      dekretowal: dekretowal,
      uwagi: this.uwagi,
      innaDoWgladu: false,
      inne: inneRows.length > 0 ? inneRows : null
    };

    this.submitting = true;
    this.dekretujService.dekretuj(dekretacja).subscribe({
      next: () => {
        if (this.przekazWgDekretacji) {
          this.przekazDokumentyPoDekretacji(inneRows, () => {
            this.submitting = false;
            this.successMessage = 'Dokument zadekretowany i przekazany';
            setTimeout(() => {
              this.dokumentDekretowany.emit();
              this.close();
            }, 1200);
          });
        } else {
          this.submitting = false;
          this.successMessage = 'Dokument zadekretowany';
          setTimeout(() => {
            this.dokumentDekretowany.emit();
            this.close();
          }, 1200);
        }
      },
      error: (err) => {
        console.error('Error dekretacja:', err);
        this.errorMessage = 'Błąd podczas dekretowania dokumentu';
        this.submitting = false;
      }
    });
  }

  private przekazDokumentyPoDekretacji(inneRows: TDekretacja[], onComplete: () => void) {
    const dokumentNumer = this.dokument.numer;
    const requests: DokumentPrzekazRequest[] = [];

    requests.push({
      Dokument: dokumentNumer,
      Jednostka: this.selectedJednostka!.symbol,
      Osoba: this.selectedOsoba!.numer
    });

    for (const row of inneRows) {
      const req: DokumentPrzekazRequest = {
        Dokument: dokumentNumer,
        Jednostka: row.komPrzyj!.symbol,
        Osoba: row.osobaPrzyj!.numer
      };
      if (row.innaDoWgladu) {
        req.dekrDoWgladu = true;
      } else {
        req.dekrKopia = true;
      }
      requests.push(req);
    }

    let completed = 0;
    let hadError = false;

    for (const req of requests) {
      this.dokumentPrzekazService.przekazDokument(req).subscribe({
        next: () => {
          completed++;
          if (completed === requests.length && !hadError) {
            onComplete();
          }
        },
        error: (err) => {
          if (!hadError) {
            hadError = true;
            console.error('Error przekaz dokumentu:', err);
            this.errorMessage = 'Błąd podczas przekazywania dokumentu';
            this.submitting = false;
          }
        }
      });
    }
  }

  close() {
    this.closeRequested.emit();
  }
}
