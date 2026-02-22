import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowiadomieniaService } from '../services/powiadomienia.service';
import { TPowiadomienie } from '../models/powiadomienie.model';

@Component({
  selector: 'app-powiadomienia-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="window-overlay" *ngIf="visible" (click)="onOverlayClick($event)">
      <div class="window-container" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2>Powiadomienia</h2>
          <button class="close-btn" (click)="onClose()" title="Zamknij">×</button>
        </div>

        <div class="window-content">
          <div class="toolbar">
            <button class="btn btn-success" (click)="onNowy()">
              + Nowy
            </button>
            <button
              class="btn btn-warning"
              [disabled]="!selectedPowiadomienie || selectedPowiadomienie.pobrano"
              (click)="onPopraw()"
            >
              ✎ Popraw
            </button>
            <button
              class="btn btn-danger"
              [disabled]="!selectedPowiadomienie || selectedPowiadomienie.pobrano"
              (click)="onUsun()"
            >
              × Usuń
            </button>
          </div>

          <div class="table-container">
            <div *ngIf="loading" class="loading-overlay">
              <div class="spinner"></div>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 80px">Pobrano</th>
                  <th style="width: 120px">Potwierdzono</th>
                  <th>Autor</th>
                  <th>Kontrahent</th>
                  <th style="width: 150px">Data</th>
                  <th style="width: 150px">Data ważności</th>
                  <th>Nagłówek</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let powiadomienie of paginatedPowiadomienia"
                  [class.selected]="selectedPowiadomienie?.numer === powiadomienie.numer"
                  (click)="selectPowiadomienie(powiadomienie)"
                >
                  <td class="text-center">
                    <span
                      [class]="powiadomienie.pobrano ? 'icon-check' : 'icon-circle'"
                      [style.color]="powiadomienie.pobrano ? 'green' : '#cbd5e1'"
                    >{{ powiadomienie.pobrano ? '✓' : '○' }}</span>
                  </td>
                  <td class="text-center">
                    <span
                      [class]="powiadomienie.potwierdzono ? 'icon-check' : 'icon-circle'"
                      [style.color]="powiadomienie.potwierdzono ? 'green' : '#cbd5e1'"
                    >{{ powiadomienie.potwierdzono ? '✓' : '○' }}</span>
                  </td>
                  <td>{{ powiadomienie.autor.identyfikator }}</td>
                  <td>{{ powiadomienie.kontrahent.identyfikator }}</td>
                  <td>{{ formatDate(powiadomienie.data) }}</td>
                  <td>{{ formatDate(powiadomienie.dataWazn) }}</td>
                  <td>{{ powiadomienie.naglowek }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button
              class="pagination-btn"
              [disabled]="currentPage === 0"
              (click)="previousPage()"
            >
              ‹ Poprzednia
            </button>
            <span class="pagination-info">
              Strona {{ currentPage + 1 }} z {{ totalPages }}
              ({{ totalRecords }} rekordów)
            </span>
            <button
              class="pagination-btn"
              [disabled]="currentPage >= totalPages - 1"
              (click)="nextPage()"
            >
              Następna ›
            </button>
          </div>

          <div class="details-panel" *ngIf="selectedPowiadomienie">
            <div class="panel-header">Szczegóły powiadomienia</div>
            <div class="panel-content">
              <div class="detail-row">
                <strong>Status:</strong>
                <div>
                  <div class="status-item">
                    <span
                      [class]="selectedPowiadomienie.pobrano ? 'icon-check' : 'icon-circle'"
                      [style.color]="selectedPowiadomienie.pobrano ? 'green' : '#cbd5e1'"
                    >{{ selectedPowiadomienie.pobrano ? '✓' : '○' }}</span>
                    <span>Pobrano: {{ selectedPowiadomienie.pobrano ? formatDate(selectedPowiadomienie.pobranoData) : 'Nie' }}</span>
                  </div>
                  <div class="status-item">
                    <span
                      [class]="selectedPowiadomienie.potwierdzono ? 'icon-check' : 'icon-circle'"
                      [style.color]="selectedPowiadomienie.potwierdzono ? 'green' : '#cbd5e1'"
                    >{{ selectedPowiadomienie.potwierdzono ? '✓' : '○' }}</span>
                    <span>Potwierdzono: {{ selectedPowiadomienie.potwierdzono ? formatDate(selectedPowiadomienie.potwierdzonoData) : 'Nie' }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-row">
                <strong>Autor:</strong>
                <span>{{ selectedPowiadomienie.autor.identyfikator }}</span>
              </div>

              <div class="detail-row">
                <strong>Kontrahent:</strong>
                <span>{{ selectedPowiadomienie.kontrahent.identyfikator }}</span>
              </div>

              <div class="detail-row">
                <strong>Email:</strong>
                <span>{{ selectedPowiadomienie.email }}</span>
              </div>

              <div class="detail-row">
                <strong>Telefon:</strong>
                <span>{{ selectedPowiadomienie.telefon || 'Brak' }}</span>
              </div>

              <div class="detail-row">
                <strong>Data:</strong>
                <span>{{ formatDate(selectedPowiadomienie.data) }}</span>
              </div>

              <div class="detail-row">
                <strong>Data ważności:</strong>
                <span>{{ formatDate(selectedPowiadomienie.dataWazn) }}</span>
              </div>

              <div class="detail-row">
                <strong>Nagłówek:</strong>
                <span>{{ selectedPowiadomienie.naglowek }}</span>
              </div>

              <div class="detail-row">
                <strong>Opis:</strong>
                <span class="opis-text">{{ selectedPowiadomienie.opis }}</span>
              </div>

              <div class="detail-row" *ngIf="selectedPowiadomienie.sprawa">
                <strong>Sprawa:</strong>
                <div>
                  <div>Znak: {{ selectedPowiadomienie.sprawa.znakSprawy }}</div>
                  <div>Nazwa: {{ selectedPowiadomienie.sprawa.nazwa }}</div>
                </div>
              </div>

              <div class="detail-row" *ngIf="selectedPowiadomienie.dokument">
                <strong>Dokument:</strong>
                <div>
                  <div>Nazwa: {{ selectedPowiadomienie.dokument.nazwa }}</div>
                  <div>Nr pozycji: {{ selectedPowiadomienie.dokument.rejestrNrPozycji }}</div>
                </div>
              </div>
            </div>
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
      width: 90vw;
      max-width: 1200px;
      height: 90vh;
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

    .table-container {
      flex: 0 0 auto;
      height: 300px;
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
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
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
      padding: 10px 12px;
      font-size: 13px;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
    }

    .text-center {
      text-align: center;
    }

    .icon-check, .icon-circle {
      font-size: 18px;
      font-weight: bold;
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

    .details-panel {
      flex: 1;
      overflow: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
    }

    .panel-header {
      padding: 16px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
      color: #1e293b;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .panel-content {
      padding: 20px;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row strong {
      color: #475569;
      font-size: 14px;
    }

    .detail-row span {
      color: #1e293b;
      font-size: 14px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .opis-text {
      white-space: pre-wrap;
      line-height: 1.6;
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background: #d97706;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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
        height: 95vh;
      }

      .pagination {
        flex-direction: column;
        gap: 8px;
      }

      .detail-row {
        grid-template-columns: 1fr;
        gap: 4px;
      }
    }
  `]
})
export class PowiadomieniaWindowComponent implements OnInit {
  @Input() visible = true;
  @Input() sesja = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  powiadomienia: TPowiadomienie[] = [];
  paginatedPowiadomienia: TPowiadomienie[] = [];
  selectedPowiadomienie: TPowiadomienie | null = null;
  loading = false;
  totalRecords = 0;
  currentPage = 0;
  rowsPerPage = 5;

  constructor(private powiadomieniaService: PowiadomieniaService) {}

  ngOnInit() {
    this.initializeMockData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rowsPerPage);
  }

  initializeMockData() {
    const mockData = this.powiadomieniaService.getMockPowiadomienia();
    this.powiadomienia = mockData;
    this.totalRecords = mockData.length;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedPowiadomienia = this.powiadomienia.slice(start, end);
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

  selectPowiadomienie(powiadomienie: TPowiadomienie) {
    this.selectedPowiadomienie = powiadomienie;
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '1899-12-30T00:00:00.000Z') {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onNowy() {
    console.log('Nowe powiadomienie');
  }

  onPopraw() {
    console.log('Popraw powiadomienie:', this.selectedPowiadomienie);
  }

  onUsun() {
    console.log('Usuń powiadomienie:', this.selectedPowiadomienie);
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
