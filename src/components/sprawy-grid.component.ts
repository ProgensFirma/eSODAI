import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprawyService } from '../services/sprawy.service';
import { Sprawa } from '../models/sprawa.model';
import { Skrzynka } from '../models/skrzynka.model';

@Component({
  selector: 'app-sprawy-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sprawy-container">
      <div class="sprawy-header">
        <h3 class="sprawy-title">
          <span class="title-icon">📋</span>
          Sprawy
          <span class="sprawa-count" *ngIf="sprawy.length > 0">({{ sprawy.length }})</span>
        </h3>
        <div class="header-buttons">
          <button
            class="action-button button-refresh"
            (click)="loadSprawy()"
            [disabled]="loading"
          >
            <span class="refresh-icon" [class.spinning]="loading">↻</span>
          </button>
        </div>
      </div>

      <div class="sprawy-content" *ngIf="!loading && sprawy.length > 0">
        <div class="sprawy-table">
          <div class="table-header">
            <div class="header-cell col-number">Numer</div>
            <div class="header-cell col-name">Nazwa</div>
            <div class="header-cell col-type">Typ</div>
            <div class="header-cell col-znak">Znak sprawy</div>
            <div class="header-cell col-date">Data rozpoczęcia</div>
            <div class="header-cell col-date">Data zakończenia</div>
            <div class="header-cell col-date">Termin zakończenia</div>
          </div>

          <div class="table-body">
            <div
              *ngFor="let sprawa of sprawy; trackBy: trackByNumer"
              class="table-row"
              [class.selected]="selectedSprawa?.numer === sprawa.numer"
              [class.glowna]="sprawa.glowna"
              (click)="selectSprawa(sprawa)"
            >
              <div class="cell col-number">
                <span class="sprawa-number">{{ sprawa.numer }}</span>
              </div>
              <div class="cell col-name">
                <div class="sprawa-name">{{ sprawa.nazwa }}</div>
              </div>
              <div class="cell col-type">
                <span class="sprawa-type">{{ sprawa.typ.nazwa }}</span>
              </div>
              <div class="cell col-znak">
                <span class="znak-sprawy">{{ sprawa.znakSprawy }}</span>
              </div>
              <div class="cell col-date">
                <span class="date-value">{{ formatDate(sprawa.dataStart) }}</span>
              </div>
              <div class="cell col-date">
                <span class="date-value">{{ formatDate(sprawa.dataStop) }}</span>
              </div>
              <div class="cell col-date">
                <span class="date-value termin">{{ formatDate(sprawa.terminPlan) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && sprawy.length === 0">
        <span class="empty-icon">📋</span>
        <p>Brak spraw w wybranej skrzynce</p>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Ładowanie spraw...</p>
      </div>
    </div>
  `,
  styles: [`
    .sprawy-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .sprawy-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 2px solid #cbd5e1;
    }

    .sprawy-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .title-icon {
      font-size: 22px;
    }

    .sprawa-count {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      background: white;
      padding: 2px 10px;
      border-radius: 12px;
    }

    .header-buttons {
      display: flex;
      gap: 8px;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: white;
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-button:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #94a3b8;
      transform: translateY(-1px);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-refresh {
      padding: 8px 12px;
    }

    .refresh-icon {
      font-size: 18px;
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .sprawy-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .sprawy-table {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .table-header {
      display: grid;
      grid-template-columns: 100px 200px 150px 200px 130px 130px 130px;
      gap: 8px;
      padding: 12px 16px;
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
      font-weight: 700;
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-body {
      flex: 1;
      overflow-y: auto;
    }

    .table-body::-webkit-scrollbar {
      width: 10px;
    }

    .table-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .table-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 5px;
    }

    .table-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .table-row {
      display: grid;
      grid-template-columns: 100px 200px 150px 200px 130px 130px 130px;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .table-row.selected {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
    }

    .table-row.glowna {
      font-weight: 600;
      background: #fefce8;
    }

    .table-row.glowna:hover {
      background: #fef9c3;
    }

    .cell {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #1e293b;
    }

    .col-number {
      justify-content: center;
    }

    .sprawa-number {
      font-weight: 600;
      color: #2563eb;
      background: #eff6ff;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .sprawa-name {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sprawa-type {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      background: #f1f5f9;
      color: #475569;
      font-weight: 600;
    }

    .znak-sprawy {
      font-family: monospace;
      font-size: 12px;
      color: #475569;
    }

    .date-value {
      font-size: 13px;
      color: #64748b;
    }

    .date-value.termin {
      font-weight: 600;
      color: #dc2626;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #94a3b8;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .loading-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #64748b;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .loading-state p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class SprawyGridComponent implements OnChanges {
  @Input() selectedSkrzynka: Skrzynka | null = null;
  @Output() sprawaSelected = new EventEmitter<Sprawa>();

  sprawy: Sprawa[] = [];
  selectedSprawa: Sprawa | null = null;
  loading = false;

  constructor(private sprawyService: SprawyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSkrzynka'] && this.selectedSkrzynka) {
      this.loadSprawy();
    }
  }

  loadSprawy(): void {
    if (!this.selectedSkrzynka) {
      return;
    }

    this.loading = true;
    this.sprawyService.getSprawy(this.selectedSkrzynka.numer).subscribe({
      next: (data) => {
        this.sprawy = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sprawy:', error);
        this.loading = false;
      }
    });
  }

  selectSprawa(sprawa: Sprawa): void {
    this.selectedSprawa = sprawa;
    this.sprawaSelected.emit(sprawa);
  }

  trackByNumer(index: number, sprawa: Sprawa): number {
    return sprawa.numer;
  }

  formatDate(dateStr: string): string {
    if (!dateStr || dateStr === '1899-12-30T00:00:00.000Z') {
      return '-';
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL');
  }
}
