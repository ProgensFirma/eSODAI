import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDoreczService } from '../services/edorecz.service';
import { EDoreczWyslana, EDoreczZalacznik, EDoreczPotwierdzenie } from '../models/edorecz.model';
import { TSkrzynki } from '../models/enums.model';
import { DocumentEditWindowComponent } from './document-edit-window.component';
import { Dokument } from '../models/dokument.model';
import { DokumentyService } from '../services/dokumenty.service';

@Component({
  selector: 'app-edorecz-wys-grid',
  standalone: true,
  imports: [CommonModule, DocumentEditWindowComponent],
  template: `
    <div class="edorecz-container">
      <div class="grid-section">
        <div class="grid-header">
          <h3 class="grid-title">Dokumenty eDoreczenia wychodzące</h3>
          <div class="header-buttons">
            <button class="action-button" (click)="onDokument()" [disabled]="!selectedDokument">Dokument</button>
            <button class="action-button" (click)="onRejestrWyjscia()" [disabled]="!selectedDokument">Rejestr wyjścia</button>
            <button
              *ngIf="skrzynkaTyp === TSkrzynki.tes_KEleDoreczDoWys"
              class="action-button send-button"
              (click)="onWyslij()"
              [disabled]="!selectedDokument"
            >
              Wyślij
            </button>
            <button class="refresh-button" (click)="loadData()" [disabled]="loading">
              <span class="refresh-icon" [class.spinning]="loading">↻</span>
            </button>
          </div>
        </div>

        <div class="table-container" *ngIf="!loading && dokumenty.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Skrzynka adresata</th>
                <th>Adresat</th>
                <th>Skrzynka nadawcy</th>
                <th>Nadawca</th>
                <th>Tytuł</th>
                <th>Nr dokumentu</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let dok of dokumenty"
                (click)="selectDokument(dok)"
                [class.selected]="selectedDokument?.numer === dok.numer"
              >
                <td>{{ dok.statusDoreczeniaOpis }}</td>
                <td>{{ dok.adresatSkrzynka }}</td>
                <td>{{ dok.adresat.identyfikator }}</td>
                <td>{{ dok.nadawcaSkrzynka }}</td>
                <td>{{ dok.nadawca.identyfikator }}</td>
                <td>{{ dok.tytul }}</td>
                <td>{{ dok.dokument.rejestrNrPozycji }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="loading-spinner"></div>
          <p>Ładowanie dokumentów...</p>
        </div>

        <div class="empty-state" *ngIf="!loading && dokumenty.length === 0">
          <div class="empty-icon">📭</div>
          <p>Brak dokumentów eDoreczenia</p>
        </div>
      </div>

      <div class="details-section" *ngIf="selectedDokument">
        <div class="content-panel">
          <h4 class="panel-title">Treść</h4>
          <div class="content-text">{{ selectedDokument.tresc }}</div>
        </div>

        <div class="sub-panels">
          <div class="attachments-panel">
            <div class="panel-header">
              <h4 class="panel-title">Załączniki ({{ selectedDokument.zalaczniki.length }})</h4>
              <button
                class="download-button"
                (click)="pobierzZalacznik()"
                [disabled]="!selectedZalacznik"
              >
                Pobierz
              </button>
            </div>
            <div class="attachments-list">
              <div
                *ngFor="let zal of selectedDokument.zalaczniki"
                class="attachment-item"
                [class.selected]="selectedZalacznik?.numer === zal.numer"
                (click)="selectZalacznik(zal)"
              >
                <span class="attachment-icon">📎</span>
                <span class="attachment-name">{{ zal.plik }}</span>
              </div>
              <div *ngIf="selectedDokument.zalaczniki.length === 0" class="empty-list">
                Brak załączników
              </div>
            </div>
          </div>

          <div class="confirmations-panel">
            <div class="panel-header">
              <h4 class="panel-title">Potwierdzenia ({{ selectedDokument.potwierdzenia.length }})</h4>
              <button
                class="download-button"
                (click)="pobierzPotwierdzenie()"
                [disabled]="!selectedPotwierdzenie"
              >
                Pobierz
              </button>
            </div>
            <div class="confirmations-list">
              <div
                *ngFor="let pot of selectedDokument.potwierdzenia"
                class="confirmation-item"
                [class.selected]="selectedPotwierdzenie === pot"
                (click)="selectPotwierdzenie(pot)"
              >
                <div class="confirmation-row">
                  <span class="confirmation-label">Typ:</span>
                  <span class="confirmation-value">{{ pot.typ }}</span>
                </div>
                <div class="confirmation-row">
                  <span class="confirmation-label">Data:</span>
                  <span class="confirmation-value">{{ formatDate(pot.data) }}</span>
                </div>
                <div class="confirmation-row">
                  <span class="confirmation-label">Info:</span>
                  <span class="confirmation-value">{{ pot.info }}</span>
                </div>
              </div>
              <div *ngIf="selectedDokument.potwierdzenia.length === 0" class="empty-list">
                Brak potwierdzeń
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-selection" *ngIf="!selectedDokument && !loading">
        <div class="no-selection-icon">📄</div>
        <p>Wybierz dokument z listy powyżej</p>
      </div>
    </div>

    <app-document-edit-window
      *ngIf="showDocumentWindow && viewDokument"
      [mode]="'readonly'"
      [dokument]="viewDokument"
      (closeRequested)="closeDocumentWindow()"
    ></app-document-edit-window>
  `,
  styles: [`
    .edorecz-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      overflow-y: auto;
    }

    .grid-section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      flex-shrink: 0;
      min-height: 250px;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 1px solid #e2e8f0;
    }

    .grid-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .header-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-button {
      background: #475569;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-button:hover:not(:disabled) {
      background: #334155;
      transform: translateY(-1px);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .send-button {
      background: #10b981;
    }

    .send-button:hover:not(:disabled) {
      background: #059669;
    }

    .refresh-button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
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

    .table-container {
      overflow-x: auto;
      max-height: 400px;
      min-height: 120px;
      overflow-y: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      position: sticky;
      top: 0;
      background: #f8fafc;
      z-index: 10;
    }

    .data-table th {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }

    .data-table td {
      padding: 14px 16px;
      font-size: 14px;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
    }

    .data-table tbody tr {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .data-table tbody tr:hover {
      background: #f8fafc;
    }

    .data-table tbody tr.selected {
      background: #dbeafe;
    }

    .loading-state,
    .empty-state,
    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
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

    .details-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .content-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px 24px;
    }

    .panel-title {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }

    .content-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      min-height: 60px;
      white-space: pre-wrap;
    }

    .sub-panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .attachments-panel,
    .confirmations-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px 24px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .download-button {
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .download-button:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
    }

    .download-button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .attachments-list,
    .confirmations-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #f8fafc;
      border-radius: 6px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .attachment-item:hover {
      background: #e2e8f0;
    }

    .attachment-item.selected {
      background: #dbeafe;
      border: 2px solid #2563eb;
    }

    .attachment-icon {
      font-size: 16px;
    }

    .attachment-name {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }

    .confirmation-item {
      padding: 12px;
      background: #f8fafc;
      border-radius: 6px;
      margin-bottom: 12px;
      border-left: 3px solid #2563eb;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .confirmation-item:hover {
      background: #e2e8f0;
      transform: translateX(2px);
    }

    .confirmation-item.selected {
      background: #dbeafe;
      border-left-color: #1d4ed8;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    }

    .confirmation-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .confirmation-row:last-child {
      margin-bottom: 0;
    }

    .confirmation-label {
      font-weight: 700;
      color: #475569;
      min-width: 50px;
    }

    .confirmation-value {
      color: #1e293b;
      flex: 1;
      word-break: break-word;
    }

    .empty-list {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 14px;
    }

    @media (max-width: 1024px) {
      .sub-panels {
        grid-template-columns: 1fr;
      }

      .header-buttons {
        flex-wrap: wrap;
      }
    }
  `]
})
export class EDoreczWysGridComponent implements OnInit, OnChanges {
  @Input() skrzynkaTyp: TSkrzynki | undefined;

  dokumenty: EDoreczWyslana[] = [];
  selectedDokument: EDoreczWyslana | null = null;
  selectedZalacznik: EDoreczZalacznik | null = null;
  selectedPotwierdzenie: EDoreczPotwierdzenie | null = null;
  loading = false;
  TSkrzynki = TSkrzynki;
  showDocumentWindow = false;
  viewDokument: Dokument | null = null;

  constructor(
    private edoreczService: EDoreczService,
    private dokumentyService: DokumentyService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skrzynkaTyp'] && !changes['skrzynkaTyp'].firstChange) {
      this.loadData();
    }
  }

  loadData() {
    if (this.skrzynkaTyp !== TSkrzynki.tes_KEleDoreczDoWys && this.skrzynkaTyp !== TSkrzynki.tes_KEleDoreczWyslana) {
      return;
    }

    this.loading = true;
    this.edoreczService.getEDoreczWyslane(true, true, 1, 10).subscribe({
      next: (dokumenty) => {
        this.dokumenty = dokumenty;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading eDoreczenia wyslane:', error);
        this.loading = false;
      }
    });
  }

  selectDokument(dokument: EDoreczWyslana) {
    this.selectedDokument = dokument;
    this.selectedZalacznik = null;
    this.selectedPotwierdzenie = null;
  }

  selectZalacznik(zalacznik: EDoreczZalacznik) {
    this.selectedZalacznik = zalacznik;
  }

  selectPotwierdzenie(potwierdzenie: EDoreczPotwierdzenie) {
    this.selectedPotwierdzenie = potwierdzenie;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  pobierzZalacznik() {
    if (!this.selectedZalacznik) {
      return;
    }
    console.log('Pobieranie załącznika:', this.selectedZalacznik.plik, 'dla dokumentu:', this.selectedDokument?.numer);
  }

  pobierzPotwierdzenie() {
    if (!this.selectedPotwierdzenie) {
      return;
    }
    console.log('Pobieranie potwierdzenia:', this.selectedPotwierdzenie.typ, 'dla dokumentu:', this.selectedDokument?.numer);
  }

  onWyslij() {
    if (!this.selectedDokument) {
      return;
    }
    console.log('Wysyłanie dokumentu:', this.selectedDokument.numer);
  }

  onDokument() {
    if (!this.selectedDokument) {
      return;
    }

    this.dokumentyService.getDokument(this.selectedDokument.dokument.numer).subscribe({
      next: (dokument: Dokument) => {
        this.viewDokument = dokument;
        this.showDocumentWindow = true;
      },
      error: (error: any) => {
        console.error('Error loading document:', error);
      }
    });
  }

  closeDocumentWindow() {
    this.showDocumentWindow = false;
    this.viewDokument = null;
  }

  onRejestrWyjscia() {
    if (!this.selectedDokument) {
      return;
    }
    console.log('Otwieranie rejestru wyjścia:', this.selectedDokument.dokWyjscia.numer);
  }
}
