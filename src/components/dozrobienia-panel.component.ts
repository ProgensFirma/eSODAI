import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoZrobieniaService } from '../services/dozrobienia.service';
import { TZadNaDzisItem, TZadNaDzisTyp } from '../models/dozrobienia.model';

interface DoZrobieniaSection {
  title: string;
  typ: string;
  items: TZadNaDzisItem[];
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
        <div class="section" *ngFor="let section of sections">
          <h3 class="section-title">{{ section.title }}</h3>

          <div class="items-list" *ngIf="section.items.length > 0">
            <div class="item-row" *ngFor="let item of section.items">
              <div class="item-content">
                <div class="item-header">
                  <span class="item-znak">{{ item.znak }}</span>
                  <span class="item-data">{{ formatDate(item.data) }}</span>
                </div>
                <div class="item-nazwa">{{ item.nazwa }}</div>
                <div class="item-dotyczy">{{ item.dotyczy }}</div>
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .dozrobienia-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .dozrobienia-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
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
      background: #f1f5f9;
      border-radius: 4px;
    }

    .dozrobienia-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .dozrobienia-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .section {
      margin-bottom: 32px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      padding-bottom: 8px;
      border-bottom: 2px solid #2563eb;
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
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .item-row:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateX(2px);
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      gap: 12px;
    }

    .item-znak {
      font-size: 13px;
      font-weight: 600;
      color: #2563eb;
    }

    .item-data {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    .item-nazwa {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-dotyczy {
      font-size: 11px;
      color: #64748b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-action {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: #64748b;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .item-action:hover {
      background: #f1f5f9;
      color: #1e293b;
      border-color: #94a3b8;
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
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      color: #64748b;
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

      .section-title {
        font-size: 16px;
      }
    }
  `]
})
export class DoZrobieniaComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<TZadNaDzisItem>();

  loading = false;
  sections: DoZrobieniaSection[] = [];

  constructor(private doZrobieniaService: DoZrobieniaService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.doZrobieniaService.getDoZrobienia().subscribe({
      next: (response) => {
        this.buildSections(response.dozrobienia);
        this.loading = false;
      },
      error: (error) => {
        console.error('Błąd pobierania listy do zrobienia:', error);
        this.loading = false;
      }
    });
  }

  private buildSections(items: TZadNaDzisItem[]) {
    const sectionMap = new Map<string, DoZrobieniaSection>();

    sectionMap.set(TZadNaDzisTyp.Sprawa, {
      title: 'Sprawy',
      typ: TZadNaDzisTyp.Sprawa,
      items: []
    });

    sectionMap.set(TZadNaDzisTyp.Dokument, {
      title: 'Dokumenty',
      typ: TZadNaDzisTyp.Dokument,
      items: []
    });

    sectionMap.set(TZadNaDzisTyp.EDorecz, {
      title: 'eDoręczenia',
      typ: TZadNaDzisTyp.EDorecz,
      items: []
    });

    items.forEach(item => {
      const section = sectionMap.get(item.typ);
      if (section) {
        section.items.push(item);
      }
    });

    this.sections = Array.from(sectionMap.values());
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
