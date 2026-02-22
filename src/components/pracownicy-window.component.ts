import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracownicyService } from '../services/pracownicy.service';
import { TOsobaInfo } from '../models/typy-info.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pracownicy-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pracownicy-overlay" *ngIf="visible" (click)="onOverlayClick($event)">
      <div class="pracownicy-window" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">👥</span>
            Pracownicy
            <span class="total-count" *ngIf="filteredPracownicy.length">({{ filteredPracownicy.length }})</span>
          </h2>
          <div class="header-actions">
            <button class="close-button" (click)="onClose()" title="Zamknij">
              <span class="close-icon">✕</span>
            </button>
          </div>
        </div>

        <div class="window-content">
          <div class="pracownicy-list-section">
            <div class="list-header">
              <h3>Lista pracowników</h3>
              <div class="list-controls">
                <label class="filter-label">filtr:</label>
                <input
                  type="text"
                  class="filter-input"
                  [(ngModel)]="searchText"
                  (input)="onSearch()"
                  placeholder="Filtruj pracowników..."
                />
                <button
                  class="refresh-button"
                  (click)="loadPracownicy()"
                  [disabled]="loading"
                >
                  <span class="refresh-icon" [class.spinning]="loading">↻</span>
                </button>
              </div>
            </div>

            <div class="pracownicy-table" *ngIf="!loading && filteredPracownicy.length > 0">
              <div class="table-header">
                <div class="header-cell col-numer">Numer</div>
                <div class="header-cell col-identyfikator">Identyfikator</div>
              </div>

              <div class="table-body">
                <div
                  *ngFor="let pracownik of paginatedPracownicy"
                  class="table-row"
                  [class.selected]="selectedPracownik?.numer === pracownik.numer"
                  (click)="selectPracownik(pracownik)"
                >
                  <div class="cell col-numer">
                    <span class="numer">{{ pracownik.numer }}</span>
                  </div>
                  <div class="cell col-identyfikator">
                    <span class="identyfikator">{{ pracownik.identyfikator }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pagination-controls" *ngIf="!loading && filteredPracownicy.length > 0">
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
                  ({{ getRecordRange() }} z {{ filteredPracownicy.length }})
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
              <p>Ładowanie pracowników...</p>
            </div>

            <div class="empty-state" *ngIf="!loading && filteredPracownicy.length === 0">
              <div class="empty-icon">👥</div>
              <p>Brak pracowników</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pracownicy-overlay {
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

    .pracownicy-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90vw;
      height: 85vh;
      max-width: 1200px;
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

    .close-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .window-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow: hidden;
    }

    .pracownicy-list-section {
      flex: 1;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .list-header h3 {
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

    .pracownicy-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 150px 1fr;
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
      grid-template-columns: 150px 1fr;
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

    .cell {
      display: flex;
      align-items: center;
      font-size: 14px;
      overflow: hidden;
    }

    .numer {
      font-weight: 600;
      color: #475569;
      font-family: 'Courier New', monospace;
    }

    .identyfikator {
      font-weight: 500;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    .loading-state,
    .empty-state {
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

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-state p,
    .empty-state p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .pracownicy-window {
        width: 95vw;
        height: 90vh;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .table-header {
        display: none;
      }
    }
  `]
})
export class PracownicyWindowComponent implements OnInit {
  @Input() visible = true;
  @Output() visibleChange = new EventEmitter<boolean>();

  pracownicy: TOsobaInfo[] = [];
  filteredPracownicy: TOsobaInfo[] = [];
  paginatedPracownicy: TOsobaInfo[] = [];
  selectedPracownik: TOsobaInfo | null = null;
  loading = false;
  searchText = '';
  currentPage = 1;
  rowsPerPage = 10;

  constructor(
    private pracownicyService: PracownicyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPracownicy();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPracownicy.length / this.rowsPerPage);
  }

  loadPracownicy() {
    this.loading = true;
    const session = this.authService.getCurrentSession();
    const jednostka = session?.jednostkaAkt?.symbol || '';

    this.pracownicyService.getPracownicy(jednostka).subscribe({
      next: (data) => {
        this.pracownicy = data;
        this.filteredPracownicy = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pracownicy:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    const search = this.searchText.toLowerCase();
    this.filteredPracownicy = this.pracownicy.filter(p =>
      p.identyfikator.toLowerCase().includes(search) ||
      p.numer.toString().includes(search)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  selectPracownik(pracownik: TOsobaInfo) {
    this.selectedPracownik = pracownik;
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedPracownicy = this.filteredPracownicy.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getRecordRange(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(start + this.paginatedPracownicy.length - 1, this.filteredPracownicy.length);
    return `${start}-${end}`;
  }

  onClose() {
    this.visibleChange.emit(false);
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
