import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DokumentyService } from '../services/dokumenty.service';
import { DokumentPrzyjmijService } from '../services/dokument-przyjmij.service';
import { DokumentPodpiszService } from '../services/dokument-podpisz.service';
import { Dokument } from '../models/dokument.model';
import { Skrzynka } from '../models/skrzynka.model';
import { Sprawa } from '../models/sprawa.model';
import { TBazaOper, TeSodStatus, TSprStatusPrzek, TSkrzynki } from '../models/enums.model';
import { SprawaEditWindowComponent } from './sprawa-edit-window.component';

@Component({
  selector: 'app-documents-grid',
  standalone: true,
  imports: [CommonModule, SprawaEditWindowComponent],
  template: `
    <div class="documents-container">
      <div class="documents-header">
        <h3 class="documents-title">
          <span class="title-icon">📄</span>
          Dokumenty
          <span class="document-count" *ngIf="documents.length > 0">({{ documents.length }})</span>
        </h3>
        <div class="header-buttons">
          <ng-container *ngIf="!isPrzyjmijSkrzynka() && !isPodpisuSkrzynka()">
            <button
              class="action-button button-new"
              (click)="onNewDocument()"
              [disabled]="!selectedSkrzynka"
            >
              <span class="button-icon">➕</span>
              Nowy
            </button>
            <button
              class="action-button button-edit"
              (click)="onEditDocument()"
              [disabled]="!selectedDocument"
            >
              <span class="button-icon">✏️</span>
              Edycja
            </button>
            <button
              *ngIf="showPrzekazButton()"
              class="action-button button-przekaz"
              (click)="onPrzekazDocument()"
              [disabled]="!selectedDocument"
            >
              <span class="button-icon">📤</span>
              Przekaż
            </button>
            <button
              *ngIf="showUtworzSpraweButton()"
              class="action-button button-utworz-sprawe"
              (click)="onUtworzSpraweFromDocument()"
              [disabled]="!selectedDocument"
            >
              <span class="button-icon">📋</span>
              Utwórz sprawę
            </button>
          </ng-container>
          <ng-container *ngIf="isPodpisuSkrzynka()">
            <button
              class="action-button button-podpisz"
              [class.usluga-nieaktywna]="!podpisuUslugaAktywna"
              (click)="onPodpiszDocument(false)"
              [disabled]="!selectedDocument || podpiszLoading || !podpisuUslugaAktywna"
              [title]="!podpisuUslugaAktywna ? 'Usługa podpisu niedostępna' : ''"
            >
              <span class="button-icon">✍</span>
              {{ podpiszLoading ? 'Podpisywanie...' : 'Podpisz' }}
            </button>
            <button
              class="action-button button-oznacz"
              (click)="onPodpiszDocument(true)"
              [disabled]="!selectedDocument || podpiszLoading"
            >
              <span class="button-icon">✔</span>
              {{ podpiszLoading ? 'Oznaczanie...' : 'Oznacz podpisanie' }}
            </button>
          </ng-container>
          <button
            *ngIf="isPrzyjmijSkrzynka()"
            class="action-button button-przyjmij"
            (click)="onPrzyjmijDocument()"
            [disabled]="!selectedDocument || przyjmijLoading"
          >
            <span class="button-icon">✔</span>
            {{ przyjmijLoading ? (isPobierzSkrzynka() ? 'Pobieranie...' : 'Przyjmowanie...') : (isPobierzSkrzynka() ? 'Pobierz' : 'Przyjmij') }}
          </button>
          <button
            class="action-button button-refresh"
            (click)="loadDocuments()"
            [disabled]="loading"
          >
            <span class="refresh-icon" [class.spinning]="loading">↻</span>
          </button>
        </div>
      </div>
      
      <div class="documents-content" *ngIf="!loading && documents.length > 0">
        <div class="documents-table">
          <div class="table-header">
            <div class="header-cell col-number">Nr</div>
            <div class="header-cell col-type">Typ</div>
            <div class="header-cell col-name">Nazwa</div>
            <div class="header-cell col-register">Rejestr</div>
            <div class="header-cell col-date">Data wpływu</div>
            <div class="header-cell col-contractor">Kontrahent</div>
            <div class="header-cell col-attachments">Załączniki</div>
          </div>
          
          <div class="table-body">
            <div 
              *ngFor="let document of documents; trackBy: trackByNumer"
              class="table-row"
              [class.selected]="selectedDocument?.numer === document.numer"
              [class.financial]="document.typ.finansowy"
              (click)="selectDocument(document)"
            >
              <div class="cell col-number">
                <span class="document-number">{{ document.numer }}</span>
              </div>
              <div class="cell col-type">
                <span class="document-type" [class]="getTypeClass(document.typ.nazwa)">
                  {{ document.typ.nazwa }}
                </span>
              </div>
              <div class="cell col-name">
                <div class="document-name">{{ document.nazwa }}</div>
<!--                 <div class="document-description" *ngIf="document.opis">{{ document.opis }}</div> -->
              </div>
              <div class="cell col-register">
                <span class="register-number">{{ document.rejestrNrPozycji }}</span>
              </div>
              <div class="cell col-date">
                <span class="date">{{ formatDate(document.dataWplywu) }}</span>
              </div>
              <div class="cell col-contractor">
                <span class="contractor">{{ document.kontrahent.identyfikator }}</span>
              </div>
              <div class="cell col-attachments">
                <span class="attachments-count" *ngIf="document.zalaczniki.length > 0">
                  📎 {{ document.zalaczniki.length }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Ładowanie dokumentów...</p>
      </div>
      
      <div class="empty-state" *ngIf="!loading && documents.length === 0">
        <div class="empty-icon">📭</div>
        <p>Brak dokumentów w wybranej skrzynce</p>
      </div>

      <app-sprawa-edit-window
        [(visible)]="showSprawaEditFromDoc"
        [sprawa]="nowaSprawaFromDoc"
        [attachedDocument]="attachedDoc"
        (sprawaSaved)="onSprawaFromDocSaved()">
      </app-sprawa-edit-window>
    </div>
  `,
  styles: [`
    .documents-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 4px 12px var(--shadow-card);
      overflow: hidden;
      transition: var(--transition-theme);
    }

    .documents-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
      border-bottom: 1px solid var(--border-default);
      transition: var(--transition-theme);
    }

    .documents-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .title-icon {
      font-size: 20px;
    }

    .document-count {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .header-buttons {
      display: flex;
      gap: 8px;
    }

    .action-button {
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 600;
    }

    .button-new {
      background: #16a34a;
      color: white;
    }

    .button-new:hover:not(:disabled) {
      background: #15803d;
      transform: translateY(-1px);
    }

    .button-edit {
      background: #f59e0b;
      color: white;
    }

    .button-edit:hover:not(:disabled) {
      background: #d97706;
      transform: translateY(-1px);
    }

    .button-przekaz {
      background: #2563eb;
      color: white;
    }

    .button-przekaz:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .button-przyjmij {
      background: #16a34a;
      color: white;
    }

    .button-przyjmij:hover:not(:disabled) {
      background: #15803d;
      transform: translateY(-1px);
    }

    .button-utworz-sprawe {
      background: #0891b2;
      color: white;
    }

    .button-utworz-sprawe:hover:not(:disabled) {
      background: #0e7490;
      transform: translateY(-1px);
    }

    .button-podpisz {
      background: #15803d;
      color: white;
    }

    .button-podpisz:hover:not(:disabled) {
      background: #166534;
      transform: translateY(-1px);
    }

    .button-podpisz.usluga-nieaktywna {
      background: #6b7280;
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-oznacz {
      background: #0891b2;
      color: white;
    }

    .button-oznacz:hover:not(:disabled) {
      background: #0e7490;
      transform: translateY(-1px);
    }

    .button-refresh {
      background: #2563eb;
      color: white;
    }

    .button-refresh:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .action-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-icon {
      font-size: 16px;
    }

    .refresh-icon {
      font-size: 16px;
      transition: transform 0.5s ease;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .documents-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .documents-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 100px 120px 1fr 140px 120px 200px 80px;
      gap: 12px;
      padding: 16px 20px;
      background: var(--table-header-bg);
      border-bottom: 2px solid var(--border-default);
      font-weight: 600;
      font-size: 13px;
      color: var(--table-header-text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-body {
      flex: 1;
      overflow-y: auto;
      max-height: calc(5 * 64px); /* 5 rows * approximate row height */
    }

    .table-body::-webkit-scrollbar {
      width: 8px;
    }

    .table-body::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .table-body::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
      border: 1px solid var(--border-default);
    }

    .table-body::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    .table-row {
      display: grid;
      grid-template-columns: 100px 120px 1fr 140px 120px 200px 80px;
      gap: 12px;
      padding: 16px 20px;
      min-height: 64px;
      border-bottom: 1px solid var(--table-row-border);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: var(--table-row-hover);
      transform: translateX(2px);
    }

    .table-row.selected {
      background: var(--selected-bg);
      border-left: 4px solid var(--selected-border);
      padding-left: 16px;
    }

    .table-row.financial {
      border-left: 3px solid #16a34a;
    }

    .table-row.financial.selected {
      border-left: 4px solid var(--selected-border);
    }

    .cell {
      display: flex;
      align-items: center;
      font-size: 14px;
      overflow: hidden;
    }

    .document-number {
      font-weight: 600;
      color: var(--text-primary);
    }

    .document-type {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-faktura {
      background: var(--badge-green-bg);
      color: var(--badge-green-text);
    }

    .type-decyzja {
      background: var(--badge-blue-bg);
      color: var(--badge-blue-text);
    }

    .type-postanowienie {
      background: var(--badge-amber-bg);
      color: var(--badge-amber-text);
    }

    .type-default {
      background: var(--badge-gray-bg);
      color: var(--badge-gray-text);
    }

    .document-name {
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .document-description {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .register-number {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .date {
      color: var(--text-muted);
      font-size: 13px;
    }

    .contractor {
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .attachments-count {
      color: #16a34a;
      font-size: 12px;
      font-weight: 500;
    }

    .loading-state,
    .empty-state {
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

    @media (max-width: 1200px) {
      .table-header,
      .table-row {
        grid-template-columns: 80px 100px 1fr 120px 100px 150px 60px;
        gap: 8px;
        padding: 12px 16px;
      }

      .documents-header {
        padding: 16px 20px;
      }

      .documents-title {
        font-size: 16px;
      }
    }

    @media (max-width: 768px) {
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 4px;
      }

      .cell {
        justify-content: space-between;
        padding: 4px 0;
      }

      .cell::before {
        content: attr(data-label);
        font-weight: 600;
        color: #64748b;
        font-size: 12px;
        text-transform: uppercase;
      }

      .table-header {
        display: none;
      }
    }
  `]
})
export class DocumentsGridComponent implements OnChanges {
  @Input() selectedSkrzynka: Skrzynka | null = null;
  @Input() selectedSprawa: Sprawa | null = null;
  @Input() waitForSprawa: boolean = false;
  @Output() documentSelected = new EventEmitter<Dokument>();
  @Output() newDocumentRequested = new EventEmitter<void>();
  @Output() editDocumentRequested = new EventEmitter<Dokument>();
  @Output() przekazDocumentRequested = new EventEmitter<Dokument>();
  @Output() createSprawaFromDocumentRequested = new EventEmitter<Dokument>();
  @Output() dokumentPrzyjety = new EventEmitter<'przyjmij' | 'pobierz'>();

  documents: Dokument[] = [];
  selectedDocument: Dokument | null = null;
  loading = false;
  przyjmijLoading = false;
  podpiszLoading = false;
  podpisuUslugaAktywna = true;

  showSprawaEditFromDoc = false;
  nowaSprawaFromDoc: Sprawa = this.getEmptySprawa();
  attachedDoc: { numer: number; rejestrNrPozycji: string; nazwa: string } | null = null;

  constructor(
    private dokumentyService: DokumentyService,
    private dokumentPrzyjmijService: DokumentPrzyjmijService,
    private dokumentPodpiszService: DokumentPodpiszService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSkrzynka'] && this.selectedSkrzynka && !this.waitForSprawa) {
      if (this.isPodpisuSkrzynka()) {
        this.sprawdzUslugePodpisu();
      } else {
        this.podpisuUslugaAktywna = true;
      }
      this.loadDocuments();
    }
    if (changes['selectedSprawa'] && this.selectedSprawa) {
      this.loadDocuments();
    }
  }

  private sprawdzUslugePodpisu() {
    this.dokumentPodpiszService.checkUslugaPodpisu().subscribe(aktywna => {
      this.podpisuUslugaAktywna = aktywna;
    });
  }

  loadDocuments() {
    if (!this.selectedSkrzynka) return;

    this.loading = true;
    this.selectedDocument = null;

    if (this.selectedSprawa) {
      this.dokumentyService.getDokumentyDlaSsprawy(this.selectedSprawa.sprawaGlowna, this.selectedSprawa.glowna).subscribe({
        next: (documents) => {
          this.documents = documents;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading documents for sprawa:', error);
          this.loading = false;
        }
      });
    } else {
      const skrzynkaId = this.selectedSkrzynka.skrzynka;

      this.dokumentyService.getDokumenty(skrzynkaId, true).subscribe({
        next: (documents) => {
          this.documents = documents;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading documents:', error);
          this.loading = false;
        }
      });
    }
  }

  selectDocument(document: Dokument) {
    this.selectedDocument = document;
    this.documentSelected.emit(document);
  }

  trackByNumer(index: number, document: Dokument): number {
    return document.numer;
  }

  formatDate(dateString: string): string {
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

  getTypeClass(typeName: string): string {
    const type = typeName.toLowerCase();
    if (type.includes('faktura')) return 'type-faktura';
    if (type.includes('decyzja')) return 'type-decyzja';
    if (type.includes('postanowienie')) return 'type-postanowienie';
    return 'type-default';
  }

  onNewDocument() {
    this.newDocumentRequested.emit();
  }

  onEditDocument() {
    if (this.selectedDocument) {
      this.editDocumentRequested.emit(this.selectedDocument);
    }
  }

  onPrzekazDocument() {
    if (this.selectedDocument) {
      this.przekazDocumentRequested.emit(this.selectedDocument);
    }
  }

  showUtworzSpraweButton(): boolean {
    return this.selectedSkrzynka?.skrzynka === TSkrzynki.tps_PBiezace;
  }

  onUtworzSpraweFromDocument() {
    if (!this.selectedDocument) return;
    this.attachedDoc = {
      numer: this.selectedDocument.numer,
      rejestrNrPozycji: this.selectedDocument.rejestrNrPozycji,
      nazwa: this.selectedDocument.nazwa
    };
    this.nowaSprawaFromDoc = this.getEmptySprawa();
    this.showSprawaEditFromDoc = true;
  }

  onSprawaFromDocSaved() {
    this.showSprawaEditFromDoc = false;
    this.attachedDoc = null;
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

  showPrzekazButton(): boolean {
    if (!this.selectedSkrzynka) {
      return false;
    }
    const skrzynkaId = this.selectedSkrzynka.skrzynka;
    return skrzynkaId === TSkrzynki.tps_POtrzymane || skrzynkaId === TSkrzynki.tps_PBiezace;
  }

  isPrzyjmijSkrzynka(): boolean {
    if (!this.selectedSkrzynka) return false;
    const skrzynkaId = this.selectedSkrzynka.skrzynka;
    return skrzynkaId === TSkrzynki.tps_POtrzymane || skrzynkaId === TSkrzynki.tps_PWydzialu;
  }

  isPobierzSkrzynka(): boolean {
    return this.selectedSkrzynka?.skrzynka === TSkrzynki.tps_PWydzialu;
  }

  isPodpisuSkrzynka(): boolean {
    return this.selectedSkrzynka?.skrzynka === TSkrzynki.tps_PDoPodpisu;
  }

  onPodpiszDocument(tylkoOznacz: boolean) {
    if (!this.selectedDocument) return;

    this.podpiszLoading = true;
    this.dokumentPodpiszService.podpiszDokument(this.selectedDocument.numer, tylkoOznacz).subscribe({
      next: () => {
        this.podpiszLoading = false;
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error podpisz document:', error);
        this.podpiszLoading = false;
      }
    });
  }

  onPrzyjmijDocument() {
    if (!this.selectedDocument) return;

    const typ: 'przyjmij' | 'pobierz' = this.isPobierzSkrzynka() ? 'pobierz' : 'przyjmij';
    this.przyjmijLoading = true;
    this.dokumentPrzyjmijService.przyjmijDokument(this.selectedDocument.numer).subscribe({
      next: () => {
        this.przyjmijLoading = false;
        this.dokumentPrzyjety.emit(typ);
      },
      error: (error) => {
        console.error('Error przyjmij document:', error);
        this.przyjmijLoading = false;
      }
    });
  }
}