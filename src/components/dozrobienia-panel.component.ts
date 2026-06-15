import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoZrobieniaService } from '../services/dozrobienia.service';
import { TZadNaDzisItem, TZadNaDzisTyp, TZadNaDzisResponse } from '../models/dozrobienia.model';

interface DoZrobieniaSection {
  title: string;
  typ: TZadNaDzisTyp;
  items: TZadNaDzisItem[];
  ilosc: number;
  wyswDla0: boolean;
}

@Component({
  selector: 'app-dozrobienia-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dozrobienia-container">
      <div class="dozrobienia-header">
        <h2 class="dozrobienia-title">
          <span class="title-icon">✓</span>
          zadania na dziś
        </h2>
        <button
          class="refresh-button"
          (click)="loadData()"
          [disabled]="loading"
        >
          <span class="refresh-icon" [class.spinning]="loading">↻</span>
        </button>
      </div>

      <div class="dozrobienia-content" *ngIf="!loading">
        <ng-container *ngFor="let section of visibleSections">
          <div class="section">
            <h3 class="section-title">
              <span class="section-title-text">{{ section.title }}</span>
              <span class="section-count" *ngIf="section.ilosc > 0">{{ section.ilosc }}</span>
            </h3>

            <div class="items-list" *ngIf="section.items.length > 0">
              <div class="item-row" *ngFor="let item of section.items">
                <div class="item-col item-col-left">
                  <span class="item-znak">{{ item.znak }}</span>
                  <span class="item-nazwa">{{ item.nazwa }}</span>
                </div>
                <div class="item-col item-col-center">
                  <div class="item-dotyczy" *ngIf="item.dotyczy"><span class="item-dotyczy-label">Dotyczy:</span> {{ item.dotyczy }}</div>
                </div>
                <div class="item-col item-col-right">
                  <span class="item-data">{{ formatDate(item.data) }}</span>
                </div>
                <button
                  class="item-action"
                  (click)="onItemClick(item)"
                  title="Pokaż szczegóły"
                >
                  <span class="action-icon">🔍</span>
                </button>
              </div>
            </div>

            <div class="empty-section" *ngIf="section.items.length === 0">
              <span class="empty-icon">✓</span>
              <span class="empty-text">Brak elementów</span>
            </div>
          </div>
        </ng-container>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Ładowanie...</p>
      </div>
    </div>
  `,
  styles: [`
    .dozrobienia-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: var(--transition-theme);
    }

    .dozrobienia-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-default);
    }

    .dozrobienia-title {
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

    .refresh-button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .refresh-button:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .refresh-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .refresh-icon {
      font-size: 18px;
      transition: transform 0.5s ease;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .dozrobienia-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px 32px;
    }

    .dozrobienia-content::-webkit-scrollbar {
      width: 8px;
    }

    .dozrobienia-content::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .dozrobienia-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }

    .dozrobienia-content::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    .section {
      margin-bottom: 32px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #2563eb;
    }

    .section-title-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .section-count {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      background: #2563eb;
      border-radius: 12px;
      padding: 2px 10px;
      min-width: 28px;
      text-align: right;
      line-height: 1.6;
      flex-shrink: 0;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .item-row:hover {
      background: var(--bg-muted);
      border-color: var(--border-muted);
      transform: translateX(2px);
    }

    .item-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    .item-col-left {
      flex: 2;
      overflow: hidden;
    }

    .item-col-center {
      flex: 3;
      align-items: center;
      text-align: center;
      overflow: hidden;
    }

    .item-col-right {
      flex-shrink: 0;
      width: 80px;
      align-items: flex-end;
      text-align: right;
    }

    .item-znak {
      font-size: 13px;
      font-weight: 600;
      color: #2563eb;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-data {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      white-space: nowrap;
    }

    .item-nazwa {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-dotyczy {
      font-size: 12px;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-dotyczy-label {
      font-weight: 700;
      color: var(--text-primary);
    }

    .item-action {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border-muted);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .item-action:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
      border-color: var(--text-faint);
      transform: scale(1.05);
    }

    .action-icon {
      font-size: 16px;
    }

    .empty-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: var(--bg-subtle);
      border: 1px dashed var(--border-muted);
      border-radius: 8px;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 24px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 14px;
      font-weight: 500;
      font-style: italic;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 40px 20px;
      color: var(--text-muted);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-default);
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .loading-state p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dozrobienia-header {
        padding: 20px 24px;
      }

      .dozrobienia-title {
        font-size: 20px;
      }

      .dozrobienia-content {
        padding: 20px 24px;
      }

      .section {
        margin-bottom: 24px;
      }

      .section-title-text {
        font-size: 16px;
      }
    }
  `]
})
export class DoZrobieniaComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<TZadNaDzisItem>();

  loading = false;
  sections: DoZrobieniaSection[] = [];

  get visibleSections(): DoZrobieniaSection[] {
    return this.sections.filter(s => s.ilosc > 0 || s.wyswDla0);
  }

  constructor(private doZrobieniaService: DoZrobieniaService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.doZrobieniaService.getDoZrobienia().subscribe({
      next: (response) => {
        this.buildSections(response);
        this.loading = false;
      },
      error: (error) => {
        console.error('Błąd pobierania listy do zrobienia:', error);
        this.loading = false;
      }
    });
  }

  private buildSections(response: TZadNaDzisResponse) {
    const SECTION_CONFIG: { typ: TZadNaDzisTyp; title: string }[] = [
      { typ: TZadNaDzisTyp.Sprawa,      title: 'Sprawy przeterminowane i pilne' },
      { typ: TZadNaDzisTyp.Dokument,    title: 'Dokumenty otrzymane' },
      { typ: TZadNaDzisTyp.EDorecz,     title: 'eDoręczenia' },
      { typ: TZadNaDzisTyp.PowWyslania, title: 'Potwierdzenia' },
      { typ: TZadNaDzisTyp.DokWyslane,  title: 'Dokumenty wysłane niepotwierdzone' },
    ];

    this.sections = SECTION_CONFIG.map(cfg => {
      const stat = response.stats[cfg.typ];
      const items = (response.dozrobienia ?? []).filter(i => i.typ === cfg.typ);
      return {
        title: cfg.title,
        typ: cfg.typ,
        items,
        ilosc: stat?.ilosc ?? items.length,
        wyswDla0: stat?.wyswDla0 ?? true,
      };
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  onItemClick(item: TZadNaDzisItem) {
    this.itemClicked.emit(item);
  }
}
