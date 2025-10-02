import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DokumentyService } from '../services/dokumenty.service';
import { Dokument } from '../models/dokument.model';

@Component({
  selector: 'app-documents-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-container">
      <div class="documents-header">
        <h3 class="documents-title">
          <span class="title-icon">📄</span>
          Dokumenty
          <span class="document-count" *ngIf="documents.length > 0">({{ documents.length }})</span>
        </h3>
        <button 
          class="refresh-button"
          (click)="loadDocuments()"
          [disabled]="loading"
        >
          <span class="refresh-icon" [class.spinning]="loading">↻</span>
        </button>
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
                <div class="document-description" *ngIf="document.opis">{{ document.opis }}</div>
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
    </div>
  `,
  styles: [`
    .documents-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .documents-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 1px solid #e2e8f0;
    }

    .documents-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .title-icon {
      font-size: 20px;
    }

    .document-count {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
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
      background: #f8fafc;
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
      max-height: calc(5 * 64px); /* 5 rows * approximate row height */
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
      border: 1px solid #e2e8f0;
    }

    .table-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .table-row {
      display: grid;
      grid-template-columns: 100px 120px 1fr 140px 120px 200px 80px;
      gap: 12px;
      padding: 16px 20px;
      min-height: 64px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: #f8fafc;
      transform: translateX(2px);
    }

    .table-row.selected {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-left: 4px solid #2563eb;
      padding-left: 16px;
    }

    .table-row.financial {
      border-left: 3px solid #16a34a;
    }

    .table-row.financial.selected {
      border-left: 4px solid #2563eb;
    }

    .cell {
      display: flex;
      align-items: center;
      font-size: 14px;
      overflow: hidden;
    }

    .document-number {
      font-weight: 600;
      color: #1e293b;
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
      background: #dcfce7;
      color: #166534;
    }

    .type-decyzja {
      background: #dbeafe;
      color: #1e40af;
    }

    .type-postanowienie {
      background: #fef3c7;
      color: #92400e;
    }

    .type-default {
      background: #f1f5f9;
      color: #475569;
    }

    .document-name {
      font-weight: 500;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .document-description {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .register-number {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #475569;
    }

    .date {
      color: #64748b;
      font-size: 13px;
    }

    .contractor {
      color: #475569;
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
  @Input() selectedSkrzynka: string | null = null;
  @Output() documentSelected = new EventEmitter<Dokument>();

  documents: Dokument[] = [];
  selectedDocument: Dokument | null = null;
  loading = false;

  constructor(private dokumentyService: DokumentyService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSkrzynka'] && this.selectedSkrzynka) {
      this.loadDocuments();
    }
  }

  loadDocuments() {
    if (!this.selectedSkrzynka) return;

    this.loading = true;
    this.selectedDocument = null;
    
    // For demo purposes, using a fixed skrzynka ID
    // In real implementation, you would map skrzynka names to IDs
    const skrzynkaId = 39;
    
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
}