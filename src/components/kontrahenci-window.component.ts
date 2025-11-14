import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KontrahenciService } from '../services/kontrahenci.service';
import { KontrahentDetailed } from '../models/kontrahent.model';
import { KontrahentEditWindowComponent } from './kontrahent-edit-window.component';
import { TKontrahentInfo } from '../models/typy-info.model';

@Component({
  selector: 'app-kontrahenci-window',
  standalone: true,
  imports: [CommonModule, FormsModule, KontrahentEditWindowComponent],
  template: `
    <div class="kontrahenci-overlay" (click)="closeWindow()">
      <div class="kontrahenci-window" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">👥</span>
            Kontrahenci
            <span class="total-count" *ngIf="totalCount">({{ totalCount }})</span>
          </h2>
          <div class="header-actions">
            <button class="new-button" (click)="openNewKontrahent()" title="Nowy kontrahent">
              <span class="new-icon">➕</span>
              Nowy kontrahent
            </button>
            <button *ngIf="pWybor" class="select-button" (click)="selectAndClose()" [disabled]="!selectedKontrahent" title="Wybierz kontrahenta">
              <span class="select-icon">✓</span>
              Wybór
            </button>
            <button *ngIf="!pWybor" class="edit-button" title="Edycja danych" (click)="openEditKontrahent()">
              <span class="edit-icon">✏️</span>
              Edycja danych
            </button>
            <button class="close-button" (click)="closeWindow()" title="Zamknij">
              <span class="close-icon">✕</span>
            </button>
          </div>
        </div>

        <div class="window-content">
          <div class="kontrahenci-list-section">
            <div class="list-header">
              <h3>Lista kontrahentów</h3>
              <div class="list-controls">
                <label class="filter-label">filtr:</label>
                <input
                  type="text"
                  class="filter-input"
                  [(ngModel)]="filterText"
                  (ngModelChange)="onFilterChange()"
                  placeholder="Filtruj kontrahentów..."
                />
                <button
                  class="refresh-button"
                  (click)="loadKontrahenci()"
                  [disabled]="loading"
                >
                  <span class="refresh-icon" [class.spinning]="loading">↻</span>
                </button>
              </div>
            </div>

            <div class="kontrahenci-table" *ngIf="!loading && kontrahenci.length > 0">
              <div class="table-header">
                <div class="header-cell col-id">Identyfikator</div>
                <div class="header-cell col-type">Typ</div>
                <div class="header-cell col-pesel">PESEL</div>
                <div class="header-cell col-nip">NIP</div>
                <div class="header-cell col-place">Miejscowość</div>
              </div>
              
              <div class="table-body">
                <div 
                  *ngFor="let kontrahent of kontrahenci; trackBy: trackByNumer"
                  class="table-row"
                  [class.selected]="selectedKontrahent?.numer === kontrahent.numer"
                  [class.archived]="kontrahent.archiwum"
                  (click)="selectKontrahent(kontrahent)"
                >
                  <div class="cell col-id">
                    <span class="kontrahent-id">{{ kontrahent.identyfikator }}</span>
                  </div>
                  <div class="cell col-type">
                    <span class="type-badge" [class]="kontrahent.firma ? 'type-company' : 'type-person'">
                      {{ kontrahent.firma ? '🏢 Firma' : '👤 Osoba' }}
                    </span>
                  </div>
                  <div class="cell col-pesel">
                    <span class="pesel">{{ kontrahent.pesel || '-' }}</span>
                  </div>
                  <div class="cell col-nip">
                    <span class="nip">{{ kontrahent.nip || '-' }}</span>
                  </div>
                  <div class="cell col-place">
                    <span class="place">{{ kontrahent.adresStaly.miejscowosc || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pagination-controls" *ngIf="!loading && kontrahenci.length > 0">
              <button 
                class="page-button"
                [disabled]="currentPage === 1"
                (click)="goToPage(currentPage - 1)"
              >
                ‹ Poprzednia
              </button>
              
              <div class="page-info">
                <span class="page-numbers">
                  Strona {{ currentPage }} z {{ totalPages }}
                </span>
                <span class="records-info">
                  ({{ getRecordRange() }} z {{ totalCount }})
                </span>
              </div>
              
              <button 
                class="page-button"
                [disabled]="currentPage === totalPages"
                (click)="goToPage(currentPage + 1)"
              >
                Następna ›
              </button>
            </div>

            <div class="loading-state" *ngIf="loading">
              <div class="loading-spinner"></div>
              <p>Ładowanie kontrahentów...</p>
            </div>

            <div class="empty-state" *ngIf="!loading && kontrahenci.length === 0">
              <div class="empty-icon">👥</div>
              <p>Brak kontrahentów</p>
            </div>
          </div>

          <div class="kontrahent-details-section">
            <div class="details-header">
              <h3>Szczegóły kontrahenta</h3>
            </div>

            <div class="kontrahent-details" *ngIf="selectedKontrahent">
              <div class="details-grid">
                <!-- Basic Info -->
                <div class="detail-section">
                  <h4 class="section-title">Dane podstawowe</h4>
                  <div class="detail-row">
                    <span class="label">Numer:</span>
                    <span class="value">{{ selectedKontrahent.numer }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Identyfikator:</span>
                    <span class="value">{{ selectedKontrahent.identyfikator }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Nazwa:</span>
                    <span class="value">{{ selectedKontrahent.nazwa }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.imie">
                    <span class="label">Imię:</span>
                    <span class="value">{{ selectedKontrahent.imie }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Typ:</span>
                    <span class="value type-badge" [class]="selectedKontrahent.firma ? 'type-company' : 'type-person'">
                      {{ selectedKontrahent.firma ? '🏢 Firma' : '👤 Osoba fizyczna' }}
                    </span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.archiwum">
                    <span class="label">Status:</span>
                    <span class="value archived-badge">📦 Archiwum</span>
                  </div>
                </div>

                <!-- Personal Data -->
                <div class="detail-section" *ngIf="!selectedKontrahent.firma">
                  <h4 class="section-title">Dane osobowe</h4>
                  <div class="detail-row" *ngIf="selectedKontrahent.pesel">
                    <span class="label">PESEL:</span>
                    <span class="value pesel">{{ selectedKontrahent.pesel }}</span>
                  </div>
                  <div class="detail-row" *ngIf="isValidDate(selectedKontrahent.dataUrodzenia)">
                    <span class="label">Data urodzenia:</span>
                    <span class="value">{{ formatDateOnly(selectedKontrahent.dataUrodzenia) }}</span>
                  </div>
                  <div class="detail-row" *ngIf="isValidDate(selectedKontrahent.dataZgonu)">
                    <span class="label">Data zgonu:</span>
                    <span class="value death-date">{{ formatDateOnly(selectedKontrahent.dataZgonu) }}</span>
                  </div>
                </div>

                <!-- Company Data -->
                <div class="detail-section" *ngIf="selectedKontrahent.firma">
                  <h4 class="section-title">Dane firmy</h4>
                  <div class="detail-row" *ngIf="selectedKontrahent.nip">
                    <span class="label">NIP:</span>
                    <span class="value nip">{{ selectedKontrahent.nip }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.regon">
                    <span class="label">REGON:</span>
                    <span class="value regon">{{ selectedKontrahent.regon }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.kRS">
                    <span class="label">KRS:</span>
                    <span class="value krs">{{ selectedKontrahent.kRS }}</span>
                  </div>
                </div>

                <!-- Address -->
                <div class="detail-section">
                  <h4 class="section-title">Adres stały</h4>
                  <div class="address-display">
                    <div class="address-line" *ngIf="selectedKontrahent.adresStaly.ulica">
                      {{ selectedKontrahent.adresStaly.ulicaTyp }} {{ selectedKontrahent.adresStaly.ulica }}
                      {{ selectedKontrahent.adresStaly.nrDomu }}{{ selectedKontrahent.adresStaly.nrLokalu ? '/' + selectedKontrahent.adresStaly.nrLokalu : '' }}
                    </div>
                    <div class="address-line">
                      {{ selectedKontrahent.adresStaly.kodPoczta }} {{ selectedKontrahent.adresStaly.miejscowosc }}
                    </div>
                    <div class="address-line" *ngIf="selectedKontrahent.adresStaly.poczta && selectedKontrahent.adresStaly.poczta !== selectedKontrahent.adresStaly.miejscowosc">
                      poczta: {{ selectedKontrahent.adresStaly.poczta }}
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                <div class="detail-section">
                  <h4 class="section-title">Kontakt</h4>
                  <div class="detail-row" *ngIf="selectedKontrahent.kontakt.telefon">
                    <span class="label">Telefon:</span>
                    <span class="value phone">{{ selectedKontrahent.kontakt.telefon }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.kontakt.email">
                    <span class="label">Email:</span>
                    <span class="value email">{{ selectedKontrahent.kontakt.email }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedKontrahent.kontakt.wWW">
                    <span class="label">WWW:</span>
                    <span class="value website">{{ selectedKontrahent.kontakt.wWW }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="no-selection" *ngIf="!selectedKontrahent">
              <div class="no-selection-icon">👤</div>
              <p>Wybierz kontrahenta z listy aby zobaczyć szczegóły</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-kontrahent-edit-window
      *ngIf="showNewKontrahent"
      (closeRequested)="closeNewKontrahent()"
      (kontrahentSaved)="onKontrahentSaved($event)"
    ></app-kontrahent-edit-window>

    <app-kontrahent-edit-window
      *ngIf="showEditKontrahent"
      [kontrahent]="editingKontrahent"
      (closeRequested)="closeEditKontrahent()"
      (kontrahentSaved)="onKontrahentUpdated($event)"
    ></app-kontrahent-edit-window>
  `,
  styles: [`
    .kontrahenci-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .kontrahenci-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 95vw;
      height: 90vh;
      max-width: 1400px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border-bottom: 1px solid #1d4ed8;
    }

    .window-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .title-icon {
      font-size: 28px;
    }

    .total-count {
      font-size: 16px;
      font-weight: 500;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .new-button,
    .select-button,    
    .edit-button,
    .close-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .new-button:hover:not(:disabled),
    .edit-button:hover:not(:disabled),
    .close-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .edit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .close-button {
      padding: 8px 12px;
    }

    .window-content {
      flex: 1;
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
      padding: 20px;
      overflow: hidden;
    }

    .kontrahenci-list-section,
    .kontrahent-details-section {
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .list-header,
    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .list-header h3,
    .details-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .list-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
    }

    .filter-input {
      padding: 6px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      min-width: 200px;
      transition: all 0.2s ease;
    }

    .filter-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .refresh-button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .refresh-button:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .refresh-icon {
      font-size: 14px;
      transition: transform 0.5s ease;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .kontrahenci-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 120px 140px 140px 1fr;
      gap: 12px;
      padding: 12px 16px;
      background: #f1f5f9;
      border-bottom: 2px solid #e2e8f0;
      font-weight: 600;
      font-size: 13px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-body {
      flex: 1;
      overflow-y: auto;
    }

    .table-body::-webkit-scrollbar {
      width: 8px;
    }

    .table-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .table-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 120px 140px 140px 1fr;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .table-row.selected {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-left: 4px solid #2563eb;
      padding-left: 12px;
    }

    .table-row.archived {
      opacity: 0.7;
      background: #f9fafb;
    }

    .cell {
      display: flex;
      align-items: center;
      font-size: 14px;
      overflow: hidden;
    }

    .kontrahent-id {
      font-weight: 500;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }

    .type-company {
      background: #dbeafe;
      color: #1e40af;
    }

    .type-person {
      background: #dcfce7;
      color: #166534;
    }

    .pesel,
    .nip {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #475569;
    }

    .place {
      color: #64748b;
    }

    .pagination-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e2e8f0;
    }

    .page-button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .page-button:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .page-button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
    }

    .page-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .page-numbers {
      font-weight: 600;
      color: #1e293b;
    }

    .records-info {
      font-size: 12px;
      color: #64748b;
    }

    .kontrahent-details {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .kontrahent-details::-webkit-scrollbar {
      width: 8px;
    }

    .kontrahent-details::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .kontrahent-details::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .detail-section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #e2e8f0;
    }

    .section-title {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 6px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 12px;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #64748b;
      font-size: 14px;
      min-width: 100px;
      flex-shrink: 0;
    }

    .value {
      color: #1e293b;
      font-size: 14px;
      text-align: right;
      word-break: break-word;
    }

    .archived-badge {
      background: #fef3c7;
      color: #92400e;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .death-date {
      color: #dc2626;
      font-weight: 600;
    }

    .address-display {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .address-line {
      margin-bottom: 4px;
      color: #1e293b;
      font-size: 14px;
    }

    .address-line:last-child {
      margin-bottom: 0;
    }

    .phone,
    .email,
    .website {
      color: #2563eb;
      font-weight: 500;
    }

    .loading-state,
    .empty-state,
    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 40px 20px;
      color: #64748b;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .empty-icon,
    .no-selection-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-state p,
    .empty-state p,
    .no-selection p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    @media (max-width: 1200px) {
      .kontrahenci-window {
        width: 98vw;
        height: 95vh;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .window-content {
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
      }

      .kontrahent-details-section {
        display: none;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .table-header {
        display: none;
      }

      .cell {
        justify-content: space-between;
        padding: 4px 0;
      }
    }
  `]
})
export class KontrahenciWindowComponent implements OnInit {
  @Input() pWybor: boolean = false;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() kontrahentSelected = new EventEmitter<TKontrahentInfo>();

  kontrahenci: KontrahentDetailed[] = [];
  selectedKontrahent: KontrahentDetailed | null = null;
  loading = false;
  showNewKontrahent = false;
  showEditKontrahent = false;
  editingKontrahent: any = null;
  filterText = '';

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  constructor(private kontrahenciService: KontrahenciService) {}

  ngOnInit() {
    this.loadKontrahenci();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.selectedKontrahent = null;
    this.loadKontrahenci();
  }

  loadKontrahenci() {
    this.loading = true;
    const rekStart = (this.currentPage - 1) * this.pageSize + 1;

    this.kontrahenciService.getKontrahenci(rekStart, this.pageSize, this.filterText).subscribe({
      next: (response) => {
        this.kontrahenci = response.data;
        if (response.wynikIlosc !== undefined) {
          this.totalCount = response.wynikIlosc;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        }
        this.loading = false;

        if (this.kontrahenci.length > 0 && !this.selectedKontrahent) {
          this.selectedKontrahent = this.kontrahenci[0];
        }
      },
      error: (error) => {
        console.error('Error loading kontrahenci:', error);
        this.loading = false;
      }
    });
  }

  selectKontrahent(kontrahent: KontrahentDetailed) {
    this.selectedKontrahent = kontrahent;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.selectedKontrahent = null;
      this.loadKontrahenci();
    }
  }

  getRecordRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.kontrahenci.length - 1, this.totalCount);
    return `${start}-${end}`;
  }

  trackByNumer(index: number, kontrahent: KontrahentDetailed): number {
    return kontrahent.numer;
  }

  formatDateOnly(dateString: string): string {
    if (!dateString || dateString === '1899-12-30T00:00:00.000Z') {
      return '-';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  isValidDate(dateString: string): boolean {
    return !!(dateString && dateString !== '1899-12-30T00:00:00.000Z');
  }

  openNewKontrahent() {
    this.showNewKontrahent = true;
  }

  closeNewKontrahent() {
    this.showNewKontrahent = false;
  }

  onKontrahentSaved(formData: any) {
    console.log('Nowy kontrahent:', formData);
    this.loadKontrahenci();
  }

  openEditKontrahent() {
    if (this.selectedKontrahent) {
      this.editingKontrahent = {
        type: this.selectedKontrahent.firma ? 'company' : 'person',
        identyfikator: this.selectedKontrahent.identyfikator,
        imie: this.selectedKontrahent.imie || '',
        nazwa: this.selectedKontrahent.nazwa || '',
        pesel: this.selectedKontrahent.pesel || '',
        dataUrodzenia: this.selectedKontrahent.dataUrodzenia || '',
        nip: this.selectedKontrahent.nip || '',
        regon: this.selectedKontrahent.regon || '',
        krs: this.selectedKontrahent.kRS || '',
        ulica: this.selectedKontrahent.adresStaly.ulica || '',
        nrDomu: this.selectedKontrahent.adresStaly.nrDomu || '',
        nrLokalu: this.selectedKontrahent.adresStaly.nrLokalu || '',
        kodPoczta: this.selectedKontrahent.adresStaly.kodPoczta || '',
        miejscowosc: this.selectedKontrahent.adresStaly.miejscowosc || '',
        telefon: this.selectedKontrahent.kontakt.telefon || '',
        email: this.selectedKontrahent.kontakt.email || '',
        www: this.selectedKontrahent.kontakt.wWW || '',
        uwagi: ''
      };
      this.showEditKontrahent = true;
    }
  }

  closeEditKontrahent() {
    this.showEditKontrahent = false;
    this.editingKontrahent = null;
  }

  onKontrahentUpdated(formData: any) {
    console.log('Zaktualizowany kontrahent:', formData);
    this.loadKontrahenci();
  }

  closeWindow() {
    this.closeRequested.emit();
  }
}