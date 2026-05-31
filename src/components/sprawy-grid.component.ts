import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprawyService } from '../services/sprawy.service';
import { Sprawa } from '../models/sprawa.model';
import { Skrzynka } from '../models/skrzynka.model';
import { SprawaEditWindowComponent } from './sprawa-edit-window.component';
import { SprawaPrzekazWindowComponent, PrzekazData } from './sprawa-przekaz-window.component';
import { SprawaZakonczWindowComponent, ZakonczData } from './sprawa-zakoncz-window.component';
import { TBazaOper, TeSodStatus, TSprStatusPrzek, TSkrzynki } from '../models/enums.model';

const SKRZYNKI_PRZEKAZ_ZAKONCZ = new Set<TSkrzynki>([
  TSkrzynki.tss_SSprTermin,
  TSkrzynki.tss_SSprPilne
]);

@Component({
  selector: 'app-sprawy-grid',
  standalone: true,
  imports: [CommonModule, SprawaEditWindowComponent, SprawaPrzekazWindowComponent, SprawaZakonczWindowComponent],
  template: `
    <div class="sprawy-container">
      <div class="sprawy-header">
        <h3 class="sprawy-title">
          <span class="title-icon">📋</span>
          Sprawy
          <span class="sprawa-count" *ngIf="sprawy.length > 0">({{ sprawy.length }})</span>
        </h3>
        <div class="header-buttons">
          <!-- Skrzynki: przeterminowane i pilne -->
          <ng-container *ngIf="showPrzekazZakoncz">
            <button
              class="action-button button-przekaz"
              (click)="openPrzekazWindow(selectedSprawa!)"
              [disabled]="!selectedSprawa || loading"
            >Przekaż</button>
            <button
              class="action-button button-zakoncz"
              (click)="openZakonczWindow(selectedSprawa!)"
              [disabled]="!selectedSprawa || loading"
            >Zakończ</button>
            <button
              class="action-button button-zmien"
              (click)="editSprawa(selectedSprawa!)"
              [disabled]="!selectedSprawa || loading"
            >Zmień</button>
          </ng-container>

          <!-- Skrzynka: bieżące -->
          <ng-container *ngIf="showBiezace">
            <button
              class="action-button button-create"
              (click)="createSprawa()"
              [disabled]="loading"
            >
              <span class="plus-icon">+</span>
              Utwórz sprawę
            </button>
            <button
              class="action-button button-zmien"
              (click)="editSprawa(selectedSprawa!)"
              [disabled]="!selectedSprawa || loading"
            >Zmień</button>
          </ng-container>

          <!-- Pozostałe skrzynki -->
          <ng-container *ngIf="!showPrzekazZakoncz && !showBiezace">
            <button
              class="action-button button-create"
              (click)="createSprawa()"
              [disabled]="!selectedSkrzynka || loading"
            >
              <span class="plus-icon">+</span>
              Utwórz sprawę
            </button>
          </ng-container>

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

      <app-sprawa-edit-window
        [(visible)]="showSprawaEditWindow"
        [sprawa]="editingSprawa"
        (sprawaSaved)="onSprawaSaved()">
      </app-sprawa-edit-window>

      <app-sprawa-przekaz-window
        [visible]="showPrzekazWindow"
        [sprawa]="actionSprawa"
        (closeRequested)="closePrzekazWindow()"
        (przekazConfirmed)="onPrzekazConfirmed($event)">
      </app-sprawa-przekaz-window>

      <app-sprawa-zakoncz-window
        [visible]="showZakonczWindow"
        [sprawa]="actionSprawa"
        (closeRequested)="closeZakonczWindow()"
        (zakonczConfirmed)="onZakonczConfirmed($event)">
      </app-sprawa-zakoncz-window>
    </div>
  `,
  styles: [`
    .sprawy-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 2px 8px var(--shadow-card);
      overflow: hidden;
      transition: var(--transition-theme);
    }

    .sprawy-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
      border-bottom: 2px solid var(--border-muted);
    }

    .sprawy-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .title-icon {
      font-size: 22px;
    }

    .sprawa-count {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg-surface);
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
      border: 1px solid var(--input-border);
      border-radius: 6px;
      background: var(--input-bg);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-button:hover:not(:disabled) {
      background: var(--bg-muted);
      border-color: var(--text-faint);
      transform: translateY(-1px);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-create {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .button-create:hover:not(:disabled) {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }

    .plus-icon {
      font-size: 20px;
      font-weight: 700;
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
      background: var(--table-header-bg);
      border-bottom: 2px solid var(--border-default);
      font-weight: 700;
      font-size: 12px;
      color: var(--table-header-text);
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
      background: var(--scrollbar-track);
    }

    .table-body::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 5px;
    }

    .table-body::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    .table-row {
      display: grid;
      grid-template-columns: 100px 200px 150px 200px 130px 130px 130px;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--table-row-border);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: var(--table-row-hover);
    }

    .table-row.selected {
      background: var(--selected-bg);
      border-left: 4px solid var(--selected-border);
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
      color: var(--text-primary);
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
      background: var(--badge-gray-bg);
      color: var(--badge-gray-text);
      font-weight: 600;
    }

    .znak-sprawy {
      font-family: monospace;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .date-value {
      font-size: 13px;
      color: var(--text-muted);
    }

    .date-value.termin {
      font-weight: 600;
      color: #dc2626;
    }

    .button-przekaz {
      background: #eff6ff;
      color: #2563eb;
      border-color: #bfdbfe;
    }
    .button-przekaz:hover:not(:disabled) { background: #dbeafe; }

    .button-zakoncz {
      background: #fef2f2;
      color: #dc2626;
      border-color: #fecaca;
    }
    .button-zakoncz:hover:not(:disabled) { background: #fee2e2; }

    .button-zmien {
      background: #f0fdf4;
      color: #16a34a;
      border-color: #bbf7d0;
    }
    .button-zmien:hover:not(:disabled) { background: #dcfce7; }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--text-faint);
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
      color: var(--text-muted);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-default);
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

  showSprawaEditWindow = false;
  editingSprawa: Sprawa = this.getEmptySprawa();

  showPrzekazWindow = false;
  showZakonczWindow = false;
  actionSprawa: Sprawa | null = null;

  constructor(private sprawyService: SprawyService) {}

  get showPrzekazZakoncz(): boolean {
    return !!this.selectedSkrzynka && SKRZYNKI_PRZEKAZ_ZAKONCZ.has(this.selectedSkrzynka.skrzynka);
  }

  get showBiezace(): boolean {
    return this.selectedSkrzynka?.skrzynka === TSkrzynki.tss_SBiezace;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSkrzynka'] && this.selectedSkrzynka) {
      this.loadSprawy();
    }
  }

  loadSprawy(): void {
    if (!this.selectedSkrzynka) return;

    this.loading = true;
    this.sprawyService.getSprawy(this.selectedSkrzynka.skrzynka).subscribe({
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

  createSprawa(): void {
    this.editingSprawa = this.getEmptySprawa();
    this.showSprawaEditWindow = true;
  }

  editSprawa(sprawa: Sprawa): void {
    this.editingSprawa = { ...sprawa };
    this.showSprawaEditWindow = true;
  }

  openPrzekazWindow(sprawa: Sprawa): void {
    this.actionSprawa = sprawa;
    this.showPrzekazWindow = true;
  }

  closePrzekazWindow(): void {
    this.showPrzekazWindow = false;
    this.actionSprawa = null;
  }

  onPrzekazConfirmed(data: PrzekazData): void {
    if (!this.actionSprawa) return;
    this.sprawyService.przekazSprawa(this.actionSprawa.numer, data).subscribe({
      next: () => {
        this.closePrzekazWindow();
        this.loadSprawy();
      },
      error: (err) => console.error('Błąd przekazania sprawy:', err)
    });
  }

  openZakonczWindow(sprawa: Sprawa): void {
    this.actionSprawa = sprawa;
    this.showZakonczWindow = true;
  }

  closeZakonczWindow(): void {
    this.showZakonczWindow = false;
    this.actionSprawa = null;
  }

  onZakonczConfirmed(data: ZakonczData): void {
    this.sprawyService.zakonczSprawa(data).subscribe({
      next: () => {
        this.closeZakonczWindow();
        this.loadSprawy();
      },
      error: (err) => console.error('Błąd kończenia sprawy:', err)
    });
  }

  private getEmptySprawa(): Sprawa {
    return {
      numer: 0,
      nazwa: '',
      typ: { nazwa: '', rWA: '' },
      znakDef: '',
      znakSprawy: '',
      znak_wydzial: '',
      znak_RWA: '',
      znak_rok: new Date().getFullYear(),
      sprawaGlowna: 0,
      etapOstatni: 0,
      glowna: false,
      dataStart: '',
      dataStop: '',
      terminPlan: '',
      terminAlarm: '',
      dataOtrzymania: '',
      dataPrzyjecia: '',
      dataPrzekazania: '',
      dataOdebrania: '',
      osobaPrzek: { numer: 0, identyfikator: '' },
      statusPrzek: TSprStatusPrzek.sps_oczek,
      odrzucona: false,
      kontrahent: { numer: 0, identyfikator: '', firma: false, nip: '', adres: '' },
      nadzorWydzial: { symbol: '', nazwa: '', kod: '', stanowisko: false },
      nadzorOsoba: { numer: 0, identyfikator: '' },
      wykWydzial: { symbol: '', nazwa: '', kod: '', stanowisko: false },
      wykOsoba: { numer: 0, identyfikator: '' },
      uprawPoziom: '',
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sBrak,
      statusDane: '',
      opis: ''
    };
  }

  onSprawaSaved(): void {
    this.loadSprawy();
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
