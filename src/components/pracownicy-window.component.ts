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
    <div class="window-overlay" *ngIf="visible" (click)="onOverlayClick($event)">
      <div class="window-container" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2>Pracownicy</h2>
          <button class="close-btn" (click)="onClose()" title="Zamknij">×</button>
        </div>

        <div class="window-content">
          <div class="toolbar">
            <div class="search-field">
              <input
                type="text"
                placeholder="Szukaj..."
                [(ngModel)]="searchText"
                (input)="onSearch()"
                class="search-input"
              />
            </div>
          </div>

          <div class="table-container">
            <div *ngIf="loading" class="loading-overlay">
              <div class="spinner"></div>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 100px">Numer</th>
                  <th>Identyfikator</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let pracownik of paginatedPracownicy"
                  [class.selected]="selectedPracownik?.numer === pracownik.numer"
                  (click)="selectPracownik(pracownik)"
                >
                  <td>{{ pracownik.numer }}</td>
                  <td>{{ pracownik.identyfikator }}</td>
                </tr>
                <tr *ngIf="filteredPracownicy.length === 0">
                  <td colspan="2" class="empty-message">Brak pracowników do wyświetlenia</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination" *ngIf="filteredPracownicy.length > 0">
            <button
              class="pagination-btn"
              [disabled]="currentPage === 0"
              (click)="previousPage()"
            >
              ‹ Poprzednia
            </button>
            <span class="pagination-info">
              Strona {{ currentPage + 1 }} z {{ totalPages }}
              ({{ filteredPracownicy.length }} rekordów)
            </span>
            <button
              class="pagination-btn"
              [disabled]="currentPage >= totalPages - 1"
              (click)="nextPage()"
            >
              Następna ›
            </button>
          </div>
        </div>

        <div class="window-footer">
          <button class="btn btn-secondary" (click)="onClose()">Zamknij</button>
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
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .window-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 80vw;
      max-width: 1000px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .window-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #ffffff, #f8fafc);
    }

    .window-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      font-size: 24px;
      line-height: 1;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .window-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 24px;
      gap: 16px;
    }

    .toolbar {
      display: flex;
      gap: 12px;
    }

    .search-field {
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .table-container {
      flex: 1;
      overflow: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      position: relative;
      background: white;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      position: sticky;
      top: 0;
      background: #f8fafc;
      z-index: 1;
    }

    .data-table th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      color: #475569;
      border-bottom: 2px solid #e2e8f0;
      white-space: nowrap;
    }

    .data-table tbody tr {
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .data-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .data-table tbody tr.selected {
      background-color: #eff6ff;
    }

    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
    }

    .empty-message {
      text-align: center;
      color: #64748b;
      padding: 32px !important;
      font-style: italic;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      gap: 16px;
    }

    .pagination-btn {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      font-size: 14px;
      color: #64748b;
      white-space: nowrap;
    }

    .window-footer {
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #f8fafc;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary {
      background: #64748b;
      color: white;
    }

    .btn-secondary:hover {
      background: #475569;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .window-container {
        width: 95vw;
        height: 90vh;
      }

      .pagination {
        flex-direction: column;
        gap: 8px;
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
  currentPage = 0;
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
    this.currentPage = 0;
    this.updatePagination();
  }

  selectPracownik(pracownik: TOsobaInfo) {
    this.selectedPracownik = pracownik;
  }

  updatePagination() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedPracownicy = this.filteredPracownicy.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagination();
    }
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
