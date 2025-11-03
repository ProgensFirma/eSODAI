import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dokument } from '../models/dokument.model';
import { ZalacznikiService } from '../services/zalaczniki.service';
import { ZalacznikTresc } from '../models/zalacznik.model';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="details-container" *ngIf="document">
      <div class="details-header">
        <h3 class="details-title">
          <span class="title-icon">📋</span>
          Szczegóły dokumentu
        </h3>
        <div class="document-status">
          <span class="status-badge" [class]="getStatusClass()">
            {{ document.statusEdycji }}
          </span>
          <span class="financial-badge" *ngIf="document.typ.finansowy">
            💰 Finansowy
          </span>
        </div>
      </div>
      
      <div class="details-content">
        <div class="details-grid">
          <!-- Basic Information -->
          <div class="detail-section">
            <h4 class="section-title">Informacje podstawowe</h4>
            <div class="detail-row">
              <span class="label">Numer:</span>
              <span class="value">{{ document.numer }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Typ:</span>
              <span class="value type-badge" [class]="getTypeClass(document.typ.nazwa)">
                {{ document.typ.nazwa }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Nazwa:</span>
              <span class="value">{{ document.nazwa }}</span>
            </div>
            <div class="detail-row" *ngIf="document.opis">
              <span class="label">Opis:</span>
              <span class="value">{{ document.opis }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Rejestr:</span>
              <span class="value register">{{ document.rejestrNrPozycji }}</span>
            </div>
          </div>

          <!-- Dates -->
          <div class="detail-section">
            <h4 class="section-title">Daty</h4>
            <div class="detail-row">
              <span class="label">Data wpływu:</span>
              <span class="value">{{ formatDate(document.dataWplywu) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Data przekazania:</span>
              <span class="value">{{ formatDate(document.dataPrzekazania) }}</span>
            </div>
            <div class="detail-row" *ngIf="document.numerNaDok">
              <span class="label">Data na dokumencie:</span>
              <span class="value">{{ formatDate(document.dataNaDok) }}</span>
            </div>
            <div class="detail-row" *ngIf="isValidDate(document.dataAlert)">
              <span class="label">Data alertu:</span>
              <span class="value alert-date">{{ formatDate(document.dataAlert) }}</span>
            </div>
          </div>

          <!-- People -->
          <div class="detail-section">
            <h4 class="section-title">Osoby</h4>
            <div class="detail-row">
              <span class="label">Kontrahent:</span>
              <span class="value contractor">
                {{ document.kontrahent.identyfikator }}
                <span class="contractor-type" *ngIf="document.kontrahent.firma">(Firma)</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Przekazujący:</span>
              <span class="value">{{ document.przekazujacy.identyfikator }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Prowadzący:</span>
              <span class="value">{{ document.prowadzacy.identyfikator }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Wydział:</span>
              <span class="value department">{{ document.prowadzacyWydzial.nazwa }}</span>
            </div>
          </div>

          <!-- Financial Data -->
          <div class="detail-section" *ngIf="document.daneFinansowe">
            <h4 class="section-title">Dane finansowe</h4>
            <div class="financial-grid">
              <div class="financial-item">
                <span class="financial-label">Netto:</span>
                <span class="financial-value">{{ formatCurrency(document.daneFinansowe.netto) }}</span>
              </div>
              <div class="financial-item">
                <span class="financial-label">VAT:</span>
                <span class="financial-value">{{ formatCurrency(document.daneFinansowe.vAT) }}</span>
              </div>
              <div class="financial-item total">
                <span class="financial-label">Brutto:</span>
                <span class="financial-value">{{ formatCurrency(document.daneFinansowe.brutto) }}</span>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="detail-section" *ngIf="document.zalaczniki.length > 0">
            <h4 class="section-title">Załączniki ({{ document.zalaczniki.length }})</h4>
            <div class="attachments-list">
              <div 
                *ngFor="let attachment of document.zalaczniki" 
                class="attachment-item"
                (click)="toggleAttachmentContent(attachment.numer)"
                [class.expanded]="expandedAttachments.has(attachment.numer)"
              >
                <div class="attachment-header">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ attachment.plik }}</span>
                  <span class="attachment-number">#{{ attachment.numer }}</span>
                  <span class="expand-indicator">
                    {{ expandedAttachments.has(attachment.numer) ? '▼' : '▶' }}
                  </span>
                </div>
                
                <div class="attachment-content" *ngIf="expandedAttachments.has(attachment.numer)">
                  <div class="loading-attachment" *ngIf="loadingAttachments.has(attachment.numer)">
                    <div class="loading-spinner-small"></div>
                    <span>Ładowanie treści...</span>
                  </div>
                  
                  <div class="attachment-text" *ngIf="attachmentContents.has(attachment.numer) && !loadingAttachments.has(attachment.numer)">
                    <div class="attachment-meta">
                      <span class="meta-item">Wersja: {{ getAttachmentContent(attachment.numer)?.wersja }}</span>
                      <span class="meta-item">Data: {{ formatDate(getAttachmentContent(attachment.numer)?.data || '') }}</span>
                      <button 
                        class="download-button"
                        (click)="downloadAttachment(attachment.numer, attachment.plik)"
                        title="Pobierz załącznik"
                      >
                        📥 Pobierz
                      </button>
                    </div>
                    <div class="content-text">
                      {{ getAttachmentContent(attachment.numer)?.tresc }}
                    </div>
                  </div>
                  
                  <div class="attachment-error" *ngIf="attachmentErrors.has(attachment.numer)">
                    <span class="error-icon">⚠️</span>
                    <span>Nie udało się załadować treści załącznika</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-selection" *ngIf="!document">
      <div class="no-selection-icon">📄</div>
      <p>Wybierz dokument z listy aby zobaczyć szczegóły</p>
    </div>
  `,
  styles: [`
    .details-container {
      height: 100%;
      max-height: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border-bottom: 1px solid #e2e8f0;
    }

    .details-title {
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

    .document-status {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #f1f5f9;
      color: #475569;
    }

    .financial-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #166534;
    }

    .details-content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 24px;
    }

    .details-content::-webkit-scrollbar {
      width: 8px;
    }

    .details-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .details-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .details-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .detail-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e2e8f0;
    }

    .section-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 16px;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #64748b;
      font-size: 14px;
      min-width: 120px;
      flex-shrink: 0;
    }

    .value {
      color: #1e293b;
      font-size: 14px;
      text-align: right;
      word-break: break-word;
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
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

    .register {
      font-family: 'Courier New', monospace;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .contractor {
      font-weight: 500;
    }

    .contractor-type {
      font-size: 12px;
      color: #64748b;
      font-weight: 400;
    }

    .department {
      font-size: 13px;
      line-height: 1.4;
    }

    .alert-date {
      color: #dc2626;
      font-weight: 600;
    }

    .financial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .financial-item {
      background: white;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .financial-item.total {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      border-color: #16a34a;
    }

    .financial-label {
      display: block;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .financial-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }

    .financial-item.total .financial-value {
      color: #166534;
    }

    .attachments-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .attachment-item {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .attachment-item:hover {
      border-color: #2563eb;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
    }

    .attachment-item.expanded {
      border-color: #2563eb;
    }

    .attachment-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      width: 100%;
    }

    .attachment-icon {
      color: #16a34a;
    }

    .attachment-name {
      flex: 1;
      font-size: 14px;
      color: #1e293b;
    }

    .attachment-number {
      font-size: 12px;
      color: #64748b;
      font-family: 'Courier New', monospace;
    }

    .expand-indicator {
      margin-left: auto;
      font-size: 12px;
      color: #64748b;
      transition: transform 0.2s ease;
    }

    .attachment-content {
      border-top: 1px solid #f1f5f9;
      padding: 12px;
      background: #f8fafc;
      animation: slideDown 0.2s ease;
    }

    .loading-attachment {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 14px;
    }

    .loading-spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid #e2e8f0;
      border-top: 2px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .attachment-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .meta-item {
      font-weight: 500;
    }

    .download-button {
      background: linear-gradient(135deg, #16a34a, #22c55e);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .download-button:hover {
      background: linear-gradient(135deg, #15803d, #16a34a);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(22, 163, 74, 0.3);
    }

    .download-button:active {
      transform: translateY(0);
    }

    .content-text {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      font-size: 14px;
      line-height: 1.5;
      color: #1e293b;
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
    }

    .content-text::-webkit-scrollbar {
      width: 6px;
    }

    .content-text::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .content-text::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .attachment-error {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #dc2626;
      font-size: 14px;
      padding: 8px;
      background: #fef2f2;
      border-radius: 6px;
      border: 1px solid #fecaca;
    }

    .error-icon {
      font-size: 16px;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .no-selection {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      color: #64748b;
      padding: 40px;
    }

    .no-selection-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-selection p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }

    @media (max-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .details-content {
        padding: 16px;
      }

      .detail-section {
        padding: 16px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .value {
        text-align: left;
      }

      .financial-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentDetailsComponent {
  @Input() document: Dokument | null = null;

  expandedAttachments = new Set<number>();
  loadingAttachments = new Set<number>();
  attachmentContents = new Map<number, ZalacznikTresc>();
  attachmentErrors = new Set<number>();

  constructor(private zalacznikiService: ZalacznikiService) {}

  toggleAttachmentContent(attachmentNumber: number) {
    if (this.expandedAttachments.has(attachmentNumber)) {
      this.expandedAttachments.delete(attachmentNumber);
    } else {
      this.expandedAttachments.add(attachmentNumber);
      this.loadAttachmentContent(attachmentNumber);
    }
  }

  private loadAttachmentContent(attachmentNumber: number) {
    if (!this.document || this.attachmentContents.has(attachmentNumber)) {
      return;
    }

    this.loadingAttachments.add(attachmentNumber);
    this.attachmentErrors.delete(attachmentNumber);

    this.zalacznikiService.getZalacznikTresc(this.document.numer, attachmentNumber).subscribe({
      next: (content) => {
        this.loadingAttachments.delete(attachmentNumber);
        if (content.status === 'sOK') {
          // Decode base64 content before storing
          const decodedContent = { ...content };
          if (content.tresc) {
            try {
              decodedContent.tresc = atob(content.tresc);
            } catch (error) {
              console.error('Error decoding base64 content:', error);
              decodedContent.tresc = 'Błąd dekodowania treści załącznika';
            }
          }
          this.attachmentContents.set(attachmentNumber, decodedContent);
        } else {
          this.attachmentErrors.add(attachmentNumber);
        }
      },
      error: (error) => {
        console.error('Error loading attachment content:', error);
        this.loadingAttachments.delete(attachmentNumber);
        this.attachmentErrors.add(attachmentNumber);
      }
    });
  }

  getAttachmentContent(attachmentNumber: number): ZalacznikTresc | undefined {
    return this.attachmentContents.get(attachmentNumber);
  }

  downloadAttachment(attachmentNumber: number, fileName: string) {
    const content = this.attachmentContents.get(attachmentNumber);
    if (!content || !content.tresc) {
      return;
    }

    try {
      // Create blob from decoded content
      const blob = new Blob([content.tresc], { type: 'text/plain;charset=utf-8' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `attachment_${attachmentNumber}.txt`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '1899-12-30T00:00:00.000Z') {
      return '-';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  }

  isValidDate(dateString: string): boolean {
    return !!(dateString && dateString !== '1899-12-30T00:00:00.000Z');
  }

  getStatusClass(): string {
    if (!this.document) return '';
    if (!this.document.statusEdycji) return '';
    
    const status = this.document.statusEdycji.toLowerCase();
    if (status.includes('zmieniany')) return 'status-editing';
    if (status.includes('gotowy')) return 'status-ready';
    return 'status-default';
  }

  getTypeClass(typeName: string): string {
    const type = typeName.toLowerCase();
    if (type.includes('faktura')) return 'type-faktura';
    if (type.includes('decyzja')) return 'type-decyzja';
    if (type.includes('postanowienie')) return 'type-postanowienie';
    return 'type-default';
  }
}