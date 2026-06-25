import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EdoreczKopertaService } from '../services/edorecz-koperta.service';
import { KontrahWewService } from '../services/kontrah-wew.service';
import { EdoreczPunktNadawczy } from '../models/edorecz-punkt-nadawczy.model';
import { KontrahWew } from '../models/kontrah-wew.model';
import { DokumentWychodzacy } from '../models/dokument-wychodzacy.model';
import { TZalacznikInfo } from '../models/typy-info.model';

@Component({
  selector: 'app-edorecz-koperta-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">📨</span>
            Koperta eDoręczenia
          </h2>
          <button class="close-button" (click)="onClose()">✕</button>
        </div>

        <div class="modal-content" *ngIf="!loading">
          <div class="form-section">
            <label class="form-label">Punkt nadawczy</label>
            <select
              class="form-select"
              [(ngModel)]="selectedPunktNumer"
              (change)="onPunktNadawczyChange()"
            >
              <option *ngFor="let punkt of punktyNadawcze" [value]="punkt.numer">
                {{ punkt.nazwa }}
              </option>
            </select>
          </div>

          <div class="info-panel" *ngIf="nadawca">
            <h3 class="panel-title">Nadawca</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Nazwa:</label>
                <span>{{ nadawca.nazwa }}</span>
              </div>
              <div class="info-item">
                <label>Adres ADE:</label>
                <span>{{ nadawca.aDE }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">Typ wiadomości</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  name="typWiadomosci"
                  value="elektroniczna"
                  [(ngModel)]="typWiadomosci"
                />
                <span>Wiadomość elektroniczna</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  name="typWiadomosci"
                  value="hybrydowa"
                  [(ngModel)]="typWiadomosci"
                />
                <span>Wiadomość hybrydowa</span>
              </label>
            </div>
          </div>

          <div class="tab-content" *ngIf="typWiadomosci === 'elektroniczna'">
            <div class="detail-panel">
              <h3 class="panel-title">Odbiorca dane</h3>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Adresat Skrzynka</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="adresatSkrzynka"
                    placeholder="Adres skrzynki odbiorcy"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Adresat</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="adresat"
                    placeholder="Nazwa adresata"
                  />
                </div>
              </div>
            </div>

            <div class="detail-panel" *ngIf="dokumentWychodzacy">
              <h3 class="panel-title">Dokument wyjścia</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Numer:</label>
                  <span>{{ dokumentWychodzacy.numer }}</span>
                </div>
                <div class="info-item">
                  <label>Numer pozycji:</label>
                  <span>{{ dokumentWychodzacy.rejestrNrPozycji }}</span>
                </div>
              </div>
            </div>

            <div class="detail-panel" *ngIf="zalaczniki.length > 0">
              <h3 class="panel-title">Załączniki ({{ zalaczniki.length }})</h3>
              <div class="zalaczniki-list">
                <div class="zalacznik-item" *ngFor="let zalacznik of zalaczniki">
                  <span class="zalacznik-icon">📎</span>
                  <span class="zalacznik-name">{{ zalacznik.plik }}</span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <label class="form-label">Tytuł</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="tytul"
                placeholder="Tytuł wiadomości"
              />
            </div>

            <div class="form-section">
              <label class="form-label">Treść</label>
              <textarea
                class="form-textarea"
                [(ngModel)]="tresc"
                rows="4"
                placeholder="Treść wiadomości"
              ></textarea>
            </div>
          </div>

          <div class="tab-content" *ngIf="typWiadomosci === 'hybrydowa'">
            <div class="info-panel">
              <p class="info-text">Funkcjonalność wiadomości hybrydowej będzie dostępna wkrótce.</p>
            </div>
          </div>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="spinner-large"></div>
          <p>Ładowanie danych...</p>
        </div>

        <div class="modal-footer">
          <button class="button button-secondary" (click)="onClose()">
            <span class="button-icon">✕</span>
            Anuluj
          </button>
          <button class="button button-primary" (click)="onWyslij()">
            <span class="button-icon">📤</span>
            Wyślij
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-window {
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 20px 60px var(--shadow-md);
      max-width: 900px;
      width: 90%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
      transition: var(--transition-theme);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-default);
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .title-icon {
      font-size: 22px;
    }

    .close-button {
      background: transparent;
      border: none;
      font-size: 24px;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-select,
    .form-input,
    .form-textarea {
      padding: 10px 12px;
      border: 1px solid var(--input-border);
      border-radius: 6px;
      font-size: 14px;
      color: var(--input-text);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-select:focus,
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .radio-group {
      display: flex;
      gap: 16px;
      padding: 8px 0;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: var(--text-primary);
    }

    .radio-option input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .info-panel,
    .detail-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 16px;
    }

    .panel-title {
      margin: 0 0 12px 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .info-item span {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .zalaczniki-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .zalacznik-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 6px;
    }

    .zalacznik-icon {
      font-size: 16px;
    }

    .zalacznik-name {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-text {
      margin: 0;
      font-size: 14px;
      color: var(--text-muted);
      text-align: center;
      padding: 20px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }

    .spinner-large {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-default);
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--border-default);
      background: var(--bg-subtle);
    }

    .button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .button-secondary {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border: 1px solid var(--input-border);
    }

    .button-secondary:hover {
      background: var(--bg-muted);
    }

    .button-primary {
      background: #2563eb;
      color: white;
    }

    .button-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .button-icon {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .modal-window {
        width: 95%;
        max-height: 95vh;
      }

      .info-grid,
      .form-row {
        grid-template-columns: 1fr;
      }

      .radio-group {
        flex-direction: column;
      }
    }
  `]
})
export class EdoreczKopertaWindowComponent implements OnInit {
  @Input() dokumentWychodzacy: DokumentWychodzacy | null = null;
  @Output() closeRequested = new EventEmitter<void>();

  punktyNadawcze: EdoreczPunktNadawczy[] = [];
  selectedPunktNumer: number | null = null;
  nadawca: KontrahWew | null = null;
  loading = true;

  typWiadomosci: 'elektroniczna' | 'hybrydowa' = 'elektroniczna';

  adresatSkrzynka = '';
  adresat = '';
  tytul = '';
  tresc = '';
  zalaczniki: TZalacznikInfo[] = [];

  constructor(
    private edoreczKopertaService: EdoreczKopertaService,
    private kontrahWewService: KontrahWewService
  ) {}

  ngOnInit() {
    this.loadData();
    this.initializeFromDokument();
  }

  loadData() {
    this.loading = true;

    this.edoreczKopertaService.getPunktyNadawcze().subscribe({
      next: (punkty) => {
        this.punktyNadawcze = punkty;
        const domyslny = punkty.find(p => p.domyslny);
        if (domyslny) {
          this.selectedPunktNumer = domyslny.numer;
          this.loadDaneNadawcy(domyslny.numer);
        } else if (punkty.length > 0) {
          this.selectedPunktNumer = punkty[0].numer;
          this.loadDaneNadawcy(punkty[0].numer);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading punkty nadawcze:', error);
        this.loading = false;
      }
    });
  }

  loadDaneNadawcy(punktNumer: number) {
    this.kontrahWewService.getDaneNadawcy(punktNumer).subscribe({
      next: (nadawca) => {
        this.nadawca = nadawca;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading nadawca:', error);
        this.loading = false;
      }
    });
  }

  onPunktNadawczyChange() {
    if (this.selectedPunktNumer) {
      this.loadDaneNadawcy(this.selectedPunktNumer);
    }
  }

  initializeFromDokument() {
    if (!this.dokumentWychodzacy) return;

    if (this.dokumentWychodzacy.kontrahent) {
      this.adresat = this.dokumentWychodzacy.kontrahent.identyfikator;
    }

    if (this.dokumentWychodzacy.dokument?.nazwa) {
      this.tytul = this.dokumentWychodzacy.dokument.nazwa;
    }

    if (this.dokumentWychodzacy.dokument?.zalaczniki) {
      this.zalaczniki = this.dokumentWychodzacy.dokument.zalaczniki;
    }
  }

  onWyslij() {
    console.log('Wysyłanie koperty eDoręczenia:', {
      punktNadawczy: this.selectedPunktNumer,
      typWiadomosci: this.typWiadomosci,
      adresatSkrzynka: this.adresatSkrzynka,
      adresat: this.adresat,
      tytul: this.tytul,
      tresc: this.tresc
    });
  }

  onClose() {
    this.closeRequested.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}
