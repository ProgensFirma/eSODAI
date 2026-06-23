import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoZrobieniaService } from '../services/dozrobienia.service';
import { PrzypomnienieService } from '../services/przypomnienie.service';
import { TZadNaDzisItem, TZadNaDzisTyp, TZadNaDzisResponse } from '../models/dozrobienia.model';
import { Przypomnienie } from '../models/przypomnienie.model';

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

    <!-- Modal: Komunikat / Przypomnienie -->
    <div class="modal-overlay" *ngIf="showKomunikatModal" (click)="closeKomunikatModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">

        <div class="modal-loading-state" *ngIf="komunikatLoading">
          <div class="modal-spinner"></div>
          <p>Ładowanie...</p>
        </div>

        <ng-container *ngIf="!komunikatLoading && komunikat">
          <div class="modal-header">
            <h2 class="modal-title">{{ komunikat.naglowek }}</h2>
            <button class="modal-close-btn" (click)="closeKomunikatModal()">✕</button>
          </div>

          <div class="modal-body">
            <div class="modal-tresc">{{ komunikat.tresc }}</div>

            <div class="modal-panel" *ngIf="komunikat.osobaZlec">
              <div class="modal-panel-title">Osoba zlecająca</div>
              <div class="modal-panel-row">
                <span class="modal-panel-value">{{ komunikat.osobaZlec.identyfikator }}</span>
              </div>
            </div>

            <div class="modal-panel" *ngIf="komunikat.dokument">
              <div class="modal-panel-title">Dokument</div>
              <div class="modal-panel-row">
                <div class="modal-panel-info">
                  <span class="modal-panel-sub">{{ komunikat.dokument.rejestrNrPozycji }}</span>
                  <span class="modal-panel-value">{{ komunikat.dokument.nazwa }}</span>
                  <span class="modal-panel-sub" *ngIf="komunikat.dokument.kontrahent">
                    {{ komunikat.dokument.kontrahent.identyfikator }}
                  </span>
                </div>
                <button class="modal-lupa-btn" (click)="onShowDokument(komunikat.dokument!.numer)" title="Pokaż dokument">
                  <i class="pi pi-search"></i>
                </button>
              </div>
            </div>

            <div class="modal-panel" *ngIf="komunikat.sprawa">
              <div class="modal-panel-title">Sprawa</div>
              <div class="modal-panel-row">
                <div class="modal-panel-info">
                  <span class="modal-panel-sub">{{ komunikat.sprawa.znaksprawy }}</span>
                  <span class="modal-panel-value">{{ komunikat.sprawa.nazwa }}</span>
                </div>
                <button class="modal-lupa-btn" (click)="onShowSprawa(komunikat.sprawa!.numer)" title="Pokaż sprawę">
                  <i class="pi pi-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="modal-btn modal-btn-secondary" (click)="onPomin()">Pomiń</button>
            <button class="modal-btn modal-btn-primary" (click)="onPamietam()" [disabled]="pamietamLoading">
              {{ pamietamLoading ? 'Zapisywanie...' : 'Pamiętam' }}
            </button>
          </div>
        </ng-container>

      </div>
    </div>

    <!-- Detail modal: Dokument -->
    <div class="modal-overlay detail-overlay" *ngIf="showDetailDokumentModal && komunikat?.dokument" (click)="closeDetailDokumentModal()">
      <div class="modal-box detail-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Dokument</h2>
        </div>
        <div class="modal-body detail-body">
          <div class="detail-field">
            <span class="detail-label">Nr w rejestrze</span>
            <span class="detail-value detail-value-mono">{{ komunikat!.dokument!.rejestrNrPozycji }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Typ</span>
            <span class="detail-value">{{ komunikat!.dokument!.typ.nazwa }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Nazwa</span>
            <span class="detail-value">{{ komunikat!.dokument!.nazwa }}</span>
          </div>
          <ng-container *ngIf="komunikat!.dokument!.kontrahent">
            <div class="detail-separator"></div>
            <div class="detail-section-label">Kontrahent</div>
            <div class="detail-field">
              <span class="detail-label">Nazwa</span>
              <span class="detail-value">{{ komunikat!.dokument!.kontrahent!.identyfikator }}</span>
            </div>
            <div class="detail-field" *ngIf="komunikat!.dokument!.kontrahent!.nip">
              <span class="detail-label">NIP</span>
              <span class="detail-value detail-value-mono">{{ komunikat!.dokument!.kontrahent!.nip }}</span>
            </div>
            <div class="detail-field" *ngIf="komunikat!.dokument!.kontrahent!.adres">
              <span class="detail-label">Adres</span>
              <span class="detail-value">{{ komunikat!.dokument!.kontrahent!.adres }}</span>
            </div>
          </ng-container>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-exit" (click)="closeDetailDokumentModal()">Wyjście</button>
        </div>
      </div>
    </div>

    <!-- Detail modal: Sprawa -->
    <div class="modal-overlay detail-overlay" *ngIf="showDetailSprawaModal && komunikat?.sprawa" (click)="closeDetailSprawaModal()">
      <div class="modal-box detail-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Sprawa</h2>
        </div>
        <div class="modal-body detail-body">
          <div class="detail-field">
            <span class="detail-label">Znak sprawy</span>
            <span class="detail-value detail-value-mono">{{ komunikat!.sprawa!.znaksprawy }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Nazwa</span>
            <span class="detail-value">{{ komunikat!.sprawa!.nazwa }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Główna</span>
            <span class="detail-value">{{ komunikat!.sprawa!.glowna ? 'Tak' : 'Nie' }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Zakończona</span>
            <span class="detail-value" [style.color]="komunikat!.sprawa!.zakonczona ? '#dc2626' : '#16a34a'">
              {{ komunikat!.sprawa!.zakonczona ? 'Tak' : 'Nie' }}
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-exit" (click)="closeDetailSprawaModal()">Wyjście</button>
        </div>
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
      background: transparent;
      color: #2563eb;
      border: 2px solid #2563eb;
      border-radius: 8px;
      padding: 9px 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .refresh-button:hover:not(:disabled) {
      background: rgba(37, 99, 235, 0.12);
      transform: translateY(-1px);
    }

    .refresh-button:disabled {
      opacity: 0.5;
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

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .modal-box {
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 560px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: var(--text-muted);
    }

    .modal-loading-state p {
      margin: 12px 0 0;
      font-size: 15px;
    }

    .modal-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border-default);
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--border-default);
    }

    .modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .modal-close-btn {
      flex-shrink: 0;
      background: transparent;
      border: none;
      font-size: 18px;
      color: var(--text-muted);
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.15s;
    }

    .modal-close-btn:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-tresc {
      font-size: 15px;
      color: var(--text-primary);
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .modal-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 12px 16px;
    }

    .modal-panel-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .modal-panel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .modal-panel-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .modal-panel-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .modal-panel-sub {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .modal-lupa-btn {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 2px solid #2563eb;
      color: #2563eb;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 14px;
    }

    .modal-lupa-btn:hover {
      background: rgba(37, 99, 235, 0.12);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 24px;
      border-top: 1px solid var(--border-default);
    }

    .modal-btn {
      padding: 9px 20px;
      border-radius: 7px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .modal-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .modal-btn-secondary {
      background: transparent;
      border-color: var(--border-muted, #d1d5db);
      color: var(--text-secondary);
    }

    .modal-btn-secondary:hover {
      background: var(--bg-muted);
    }

    .modal-btn-primary {
      background: transparent;
      border-color: #16a34a;
      color: #16a34a;
    }

    .modal-btn-primary:hover:not(:disabled) {
      background: rgba(22, 163, 74, 0.12);
    }

    .modal-btn-exit {
      background: transparent;
      border-color: var(--border-muted, #d1d5db);
      color: var(--text-secondary);
    }

    .modal-btn-exit:hover {
      background: var(--bg-muted);
    }

    /* Detail overlay sits above the komunikat modal */
    .detail-overlay {
      z-index: 1010;
      background: rgba(0, 0, 0, 0.45);
    }

    .detail-box {
      max-width: 480px;
    }

    .detail-body {
      gap: 8px;
    }

    .detail-field {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-default);
    }

    .detail-field:last-child {
      border-bottom: none;
    }

    .detail-label {
      flex-shrink: 0;
      width: 120px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding-top: 1px;
    }

    .detail-value {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .detail-value-mono {
      font-family: monospace;
      font-size: 13px;
    }

    .detail-separator {
      height: 1px;
      background: var(--border-default);
      margin: 8px 0 4px;
    }

    .detail-section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
  `]
})
export class DoZrobieniaComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<TZadNaDzisItem>();

  loading = false;
  sections: DoZrobieniaSection[] = [];

  showKomunikatModal = false;
  komunikatLoading = false;
  komunikat: Przypomnienie | null = null;
  pamietamLoading = false;

  showDetailDokumentModal = false;
  showDetailSprawaModal = false;

  get visibleSections(): DoZrobieniaSection[] {
    return this.sections.filter(s => s.ilosc > 0 || s.wyswDla0);
  }

  constructor(
    private doZrobieniaService: DoZrobieniaService,
    private przypomnienieService: PrzypomnienieService
  ) {}

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
      { typ: TZadNaDzisTyp.Komunikat,   title: 'Komunikaty' },
      { typ: TZadNaDzisTyp.Sprawa,      title: 'Sprawy przeterminowane i pilne' },
      { typ: TZadNaDzisTyp.Dokument,    title: 'Dokumenty otrzymane' },
      { typ: TZadNaDzisTyp.EDorecz,     title: 'eDoręczenia' },
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
    if (item.typ === TZadNaDzisTyp.Komunikat) {
      this.openKomunikatModal(item.numer);
      return;
    }
    this.itemClicked.emit(item);
  }

  private openKomunikatModal(numer: number) {
    this.komunikat = null;
    this.showKomunikatModal = true;
    this.komunikatLoading = true;
    this.przypomnienieService.getPrzypomnienie(numer).subscribe({
      next: (data) => {
        this.komunikat = data;
        this.komunikatLoading = false;
      },
      error: () => {
        this.komunikatLoading = false;
        this.showKomunikatModal = false;
      }
    });
  }

  closeKomunikatModal() {
    this.showKomunikatModal = false;
    this.komunikat = null;
    this.pamietamLoading = false;
  }

  onPomin() {
    this.closeKomunikatModal();
  }

  onPamietam() {
    if (!this.komunikat) return;
    this.pamietamLoading = true;
    this.przypomnienieService.przeczytane(this.komunikat.numer).subscribe({
      next: () => {
        this.pamietamLoading = false;
        this.closeKomunikatModal();
        this.loadData();
      },
      error: () => {
        this.pamietamLoading = false;
        this.closeKomunikatModal();
      }
    });
  }

  onShowDokument(_numer: number) {
    this.showDetailDokumentModal = true;
  }

  onShowSprawa(_numer: number) {
    this.showDetailSprawaModal = true;
  }

  closeDetailDokumentModal() {
    this.showDetailDokumentModal = false;
  }

  closeDetailSprawaModal() {
    this.showDetailSprawaModal = false;
  }
}
