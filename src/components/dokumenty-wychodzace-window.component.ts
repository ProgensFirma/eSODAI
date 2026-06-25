import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DokumentWychodzacy } from '../models/dokument-wychodzacy.model';
import { DokumentyWychodzaceService } from '../services/dokumenty-wychodzace.service';
import { SessionData } from '../models/session.model';
import { AuthService } from '../services/auth.service';
import { ZalacznikiService } from '../services/zalaczniki.service';
import { openOrDownloadBase64File } from '../functions/fun-zalacznikow';
import { EdoreczKopertaWindowComponent } from './edorecz-koperta-window.component';

@Component({
  selector: 'app-dokumenty-wychodzace-window',
  standalone: true,
  imports: [CommonModule, FormsModule, EdoreczKopertaWindowComponent],
  template: `
    <div class="modal-overlay">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">📤</span>
            Dokumenty wychodzące
          </h2>
          <button class="close-button" (click)="onClose()">✕</button>
        </div>

        <div class="filter-section">
          <div class="filter-group">
            <label class="filter-label">Rejestr</label>
            <input
              type="text"
              class="filter-input"
              [(ngModel)]="filterRejestr"
              placeholder="np. RPW"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Rok</label>
            <input
              type="number"
              class="filter-input"
              [(ngModel)]="filterRejestrRok"
              placeholder="Rok"
            />
          </div>

          <button class="filter-button" (click)="applyFilter()">
            <span class="button-icon">🔍</span>
            Filtruj
          </button>

          <button class="clear-button" (click)="clearFilter()">
            <span class="button-icon">✕</span>
            Wyczyść
          </button>
        </div>

        <div class="modal-content">
          <div class="grid-container" *ngIf="!loading && dokumenty.length > 0">
            <table class="data-grid">
              <thead>
                <tr>
                  <th>Numer</th>
                  <th>Nazwa dokumentu</th>
                  <th>Kontrahent</th>
                  <th>Data wyjścia</th>
                  <th>Godz. wyjścia</th>
                  <th>Kanał wysyłki</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let dok of getPaginatedData()"
                  (click)="selectDokument(dok)"
                  [class.selected]="selectedDokument?.numer === dok.numer"
                >
                  <td>{{ dok.rejestrNrPozycji }}</td>
                  <td>{{ dok.dokument?.nazwa || '-' }}</td>
                  <td>{{ dok.kontrahent?.identyfikator || '-' }}</td>
                  <td>{{ formatDate(dok.dataWyjscia) }}</td>
                  <td>{{ formatTime(dok.godzWyjscia) }}</td>
                  <td>{{ formatKanalWysylki(dok.kanalWysylki) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="pagination">
              <button
                class="pagination-button"
                (click)="goToFirstPage()"
                [disabled]="currentPage === 1"
              >
                <span class="button-icon">⏮</span>
              </button>
              <button
                class="pagination-button"
                (click)="previousPage()"
                [disabled]="currentPage === 1"
              >
                <span class="button-icon">◀</span>
              </button>
              <span class="pagination-info">
                Strona {{ currentPage }} z {{ getTotalPages() }}
              </span>
              <button
                class="pagination-button"
                (click)="nextPage()"
                [disabled]="currentPage === getTotalPages()"
              >
                <span class="button-icon">▶</span>
              </button>
              <button
                class="pagination-button"
                (click)="goToLastPage()"
                [disabled]="currentPage === getTotalPages()"
              >
                <span class="button-icon">⏭</span>
              </button>
            </div>
          </div>

          <div class="loading-state" *ngIf="loading">
            <div class="spinner-large"></div>
            <p>Ładowanie dokumentów wychodzących...</p>
          </div>

          <div class="empty-state" *ngIf="!loading && dokumenty.length === 0">
            <span class="empty-icon">📭</span>
            <p>Brak dokumentów wychodzących</p>
          </div>

          <div class="details-section" *ngIf="selectedDokument && !loading">
            <div class="detail-panel" *ngIf="selectedDokument.dokument">
              <div class="panel-header">
                <h3 class="panel-title">Szczegóły dokumentu źródłowego</h3>
                <button
                  class="button button-primary button-small"
                  [disabled]="!selectedDokument.wysylkaeDorecz"
                  (click)="pobierzPotwierdzenie()"
                >
                  <span class="button-icon">📄</span>
                  Potwierdzenie
                </button>
              </div>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Numer:</label>
                  <span>{{ selectedDokument.dokument.numer }}</span>
                </div>
                <div class="detail-item">
                  <label>Typ:</label>
                  <span>{{ selectedDokument.dokument.typ.nazwa }}</span>
                </div>
                <div class="detail-item">
                  <label>Nazwa:</label>
                  <span>{{ selectedDokument.dokument.nazwa }}</span>
                </div>
                <div class="detail-item">
                  <label>Nr pozycji rejestru:</label>
                  <span>{{ selectedDokument.dokument.rejestrNrPozycji }}</span>
                </div>
                <div class="detail-item">
                  <label>Finansowy:</label>
                  <span>{{ selectedDokument.dokument.typ.finansowy ? 'Tak' : 'Nie' }}</span>
                </div>
                <div class="detail-item full-width" *ngIf="selectedDokument.dokument.zalaczniki && selectedDokument.dokument.zalaczniki.length > 0">
                  <label>Załączniki:</label>
                  <div class="zalaczniki-list">
                    <button
                      *ngFor="let zalacznik of selectedDokument.dokument.zalaczniki"
                      class="button button-secondary button-small"
                      (click)="pobierzZalacznik(selectedDokument.dokument!.numer, zalacznik.numer, zalacznik.plik)"
                    >
                      <span class="button-icon">📎</span>
                      {{ zalacznik.plik }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-panel" *ngIf="selectedDokument.kontrahent">
              <h3 class="panel-title">Kontrahent</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Identyfikator:</label>
                  <span>{{ selectedDokument.kontrahent.identyfikator }}</span>
                </div>
                <div class="detail-item">
                  <label>NIP:</label>
                  <span>{{ selectedDokument.kontrahent.nip || '-' }}</span>
                </div>
                <div class="detail-item full-width">
                  <label>Adres:</label>
                  <span>{{ selectedDokument.kontrahent.adres }}</span>
                </div>
                <div class="detail-item">
                  <label>Typ:</label>
                  <span>{{ selectedDokument.kontrahent.firma ? 'Firma' : 'Osoba' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-panel" *ngIf="selectedDokument.doWiadomosci && selectedDokument.doWiadomosci.length > 0">
              <h3 class="panel-title">
                Do wiadomości ({{ selectedDokument.doWiadomosci.length }})
              </h3>
              <div class="wiadomosci-list">
                <div class="wiadomosc-item" *ngFor="let wiadomosc of selectedDokument.doWiadomosci">
                  <div class="wiadomosc-header">
                    <span class="wiadomosc-icon">📧</span>
                    <span class="wiadomosc-kontrahent">
                      {{ wiadomosc.kontrahent?.identyfikator || 'Brak kontrahenta' }}
                    </span>
                  </div>
                  <div class="wiadomosc-details" *ngIf="wiadomosc.osoba">
                    <label>Osoba:</label>
                    <span>{{ wiadomosc.osoba.identyfikator }}</span>
                  </div>
                  <div class="wiadomosc-details" *ngIf="wiadomosc.kontrahent">
                    <label>Adres:</label>
                    <span>{{ wiadomosc.kontrahent.adres }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="button button-primary"
            (click)="utworzEdorecz()"
            [disabled]="!selectedDokument"
            title="Przygotowanie koperty eDoręczeń"
          >
            <span class="button-icon">📨</span>
            Utwórz eDoręczenie
          </button>
          <button class="button button-secondary" (click)="onClose()">
            <span class="button-icon">✕</span>
            Zamknij
          </button>
        </div>
      </div>
    </div>

    <app-edorecz-koperta-window
      *ngIf="showEdoreczKoperta"
      [dokumentWychodzacy]="selectedDokument"
      (closeRequested)="closeEdoreczKoperta()"
    ></app-edorecz-koperta-window>
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
      z-index: 2000;
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
      max-width: 1600px;
      width: 95%;
      max-height: 95vh;
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

    .filter-section {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      padding: 16px 24px;
      background: var(--bg-subtle);
      border-bottom: 1px solid var(--border-default);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 0 0 200px;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .filter-input {
      padding: 8px 12px;
      border: 1px solid var(--input-border);
      border-radius: 6px;
      font-size: 14px;
      color: var(--input-text);
      transition: all 0.2s ease;
    }

    .filter-input:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .filter-button,
    .clear-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-button {
      background: #2563eb;
      color: white;
    }

    .filter-button:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .clear-button {
      background: var(--bg-surface);
      color: var(--text-muted);
      border: 1px solid var(--input-border);
    }

    .clear-button:hover {
      background: var(--bg-muted);
    }

    .button-icon {
      font-size: 14px;
    }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
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

    .grid-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .data-grid {
      width: 100%;
      border-collapse: collapse;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      overflow: hidden;
    }

    .data-grid thead {
      background: var(--table-header-bg);
    }

    .data-grid th {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 700;
      color: var(--table-header-text);
      border-bottom: 2px solid var(--border-muted);
    }

    .data-grid tbody tr {
      border-bottom: 1px solid var(--border-default);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .data-grid tbody tr:hover {
      background: var(--table-row-hover);
    }

    .data-grid tbody tr.selected {
      background: var(--selected-bg);
      border-left: 3px solid var(--selected-border);
    }

    .data-grid td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--text-primary);
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 0;
    }

    .pagination-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--bg-surface);
      border: 1px solid var(--border-muted);
      border-radius: 6px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-button:not(:disabled):hover {
      background: var(--bg-muted);
      border-color: var(--text-faint);
    }

    .pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .pagination-info {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 150px;
      text-align: center;
    }

    .loading-state,
    .empty-state {
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

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .details-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .detail-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 16px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .panel-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .button-small {
      padding: 6px 12px;
      font-size: 13px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item.full-width {
      grid-column: 1 / -1;
    }

    .detail-item label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .detail-item span {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .zalaczniki-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .wiadomosci-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .wiadomosc-item {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      padding: 12px;
      transition: all 0.2s ease;
    }

    .wiadomosc-item:hover {
      border-color: var(--border-muted);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .wiadomosc-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .wiadomosc-icon {
      font-size: 18px;
    }

    .wiadomosc-kontrahent {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .wiadomosc-details {
      display: flex;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .wiadomosc-details label {
      font-weight: 600;
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

    .button-primary {
      background: #2563eb;
      color: white;
    }

    .button-primary:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .button-primary:disabled {
      background: var(--text-faint);
      cursor: not-allowed;
      opacity: 0.5;
    }

    .button-secondary {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border: 1px solid var(--input-border);
    }

    .button-secondary:hover {
      background: var(--bg-muted);
    }

    @media (max-width: 768px) {
      .modal-window {
        width: 95%;
        max-height: 95vh;
      }

      .filter-section {
        flex-wrap: wrap;
      }

      .filter-group {
        flex: 1 1 150px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .data-grid {
        font-size: 12px;
      }

      .data-grid th,
      .data-grid td {
        padding: 8px;
      }
    }
  `]
})
export class DokumentyWychodzaceWindowComponent implements OnInit {
  @Input() dokumentNumer: number | null = null;
  @Input() autoOpenEdorecz = false;
  @Output() closeRequested = new EventEmitter<void>();

  dokumenty: DokumentWychodzacy[] = [];
  filteredDokumenty: DokumentWychodzacy[] = [];
  selectedDokument: DokumentWychodzacy | null = null;
  loading = false;

  filterRejestr = '';
  filterRejestrRok: number = new Date().getFullYear();

  currentPage = 1;
  pageSize = 5;

  sessionData!: SessionData;
  showEdoreczKoperta = false;

  constructor(
    private dokumentyWychodzaceService: DokumentyWychodzaceService,
    private authService: AuthService,
    private zalacznikiService: ZalacznikiService
  ) {}

  ngOnInit() {
    const sessionData = this.authService.getCurrentSession();
    if (sessionData) {
      this.sessionData = sessionData;
    }
    this.loadDokumenty();
  }

  loadDokumenty() {
    const sesja = this.sessionData?.sesja || 0;

    this.loading = true;
    this.dokumentyWychodzaceService.getDokumentyWychodzace(
      sesja,
      true,
      this.filterRejestr || undefined,
      this.filterRejestrRok || undefined
    ).subscribe({
      next: (data) => {
        this.dokumenty = data;
        this.filteredDokumenty = data;
        this.loading = false;
        this.currentPage = 1;
        if (this.dokumentNumer) {
          const found = data.find(d => d.dokument?.numer === this.dokumentNumer);
          if (found) {
            this.selectedDokument = found;
            const pageIdx = data.indexOf(found);
            this.currentPage = Math.floor(pageIdx / this.pageSize) + 1;
            if (this.autoOpenEdorecz) {
              this.showEdoreczKoperta = true;
            }
          }
        }
      },
      error: (error) => {
        console.error('Error loading dokumenty wychodzace:', error);
        this.loading = false;
      }
    });
  }

  applyFilter() {
    this.loadDokumenty();
  }

  clearFilter() {
    this.filterRejestr = '';
    this.filterRejestrRok = new Date().getFullYear();
    this.loadDokumenty();
  }

  selectDokument(dokument: DokumentWychodzacy) {
    this.selectedDokument = dokument;
  }

  getPaginatedData(): DokumentWychodzacy[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredDokumenty.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredDokumenty.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToLastPage() {
    this.currentPage = this.getTotalPages();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL');
  }

  formatTime(godzWyjscia: number): string {
    if (!godzWyjscia) return '-';
    const hours = Math.floor(godzWyjscia * 24);
    const minutes = Math.floor((godzWyjscia * 24 * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  pobierzPotwierdzenie() {
    if (!this.selectedDokument?.wysylkaeDorecz) {
      return;
    }
    console.log('Pobieranie potwierdzenia dla dokumentu:', this.selectedDokument.numer);
  }

  pobierzZalacznik(dokumentNumer: number, zalacznikNumer: number, filename: string) {
    const sesja = this.sessionData?.sesja || 0;
    this.zalacznikiService.getZalacznikTresc(sesja, dokumentNumer, zalacznikNumer).subscribe({
      next: (zalacznik) => {
        if (zalacznik.tresc) {
          openOrDownloadBase64File(filename, zalacznik.tresc);
        }
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
  }

  formatKanalWysylki(kanal: string): string {
    const kanaly: { [key: string]: string } = {
      'tk_brak': 'Brak',
      'tk_papierowy': 'Papierowy',
      'tk_email': 'E-mail',
      'tk_ePuap': 'ePUAP',
      'tk_eDorecz': 'eDoręczenia',
      'tk_Portal': 'Portal'
    };
    return kanaly[kanal] || kanal;
  }

  utworzEdorecz() {
    if (this.selectedDokument) {
      this.showEdoreczKoperta = true;
    }
  }

  closeEdoreczKoperta() {
    this.showEdoreczKoperta = false;
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
