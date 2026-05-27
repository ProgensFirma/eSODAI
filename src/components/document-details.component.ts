import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dokument } from '../models/dokument.model';
import { ZalacznikiService } from '../services/zalaczniki.service';
import { AuthService } from '../services/auth.service';
import { openOrDownloadBase64File } from '../functions/fun-zalacznikow';

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
        <div class="header-right">
          <span class="register-tag">{{ document.rejestrNrPozycji }}</span>
          <div class="status-icons">
            <span
              class="status-icon"
              [title]="getStatusEdycjiLabel()"
              [class]="'icon-status-' + (document.statusEdycji || 'default')"
            >{{ getStatusEdycjiIcon() }}</span>
            <span
              class="status-icon"
              [title]="getStatusPrzekLabel()"
              [class]="'icon-przek-' + document.statusPrzek"
            >{{ getStatusPrzekIcon() }}</span>
            <span
              class="status-icon icon-fin"
              title="Finansowy"
              *ngIf="document.typ.finansowy"
            >💰</span>
            <span
              class="status-icon icon-archiwum"
              title="Archiwum"
              *ngIf="document.archiwum"
            >🗄️</span>
            <span
              class="status-icon icon-publiczny"
              title="Publiczny"
              *ngIf="document.publiczny"
            >🌐</span>
          </div>
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
              <span class="value">{{ document.dataNaDok ? formatDate(document.dataNaDok) : '' }}</span>
            </div>
            <div class="detail-row" *ngIf="isValidDate(document.dataAlert || '')">
              <span class="label">Data alertu:</span>
              <span class="value alert-date">{{ document.dataAlert ? formatDate(document.dataAlert) : '' }}</span>
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
                <span class="financial-value">{{ formatCurrency(document.daneFinansowe.vat) }}</span>
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
              >
                <div class="attachment-header">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ attachment.plik }}</span>
                  <button
                    class="download-button"
                    (click)="pobierzZalacznik(attachment.numer, attachment.plik)"
                    title="Pobierz załącznik"
                  >
                    📥 Pobierz
                  </button>
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
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 4px 12px var(--shadow-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: var(--transition-theme);
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
      border-bottom: 1px solid var(--border-default);
    }

    .details-title {
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

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .register-tag {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--text-primary);
      color: var(--bg-surface);
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .status-icons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      font-size: 15px;
      cursor: default;
      transition: transform 0.15s ease;
    }

    .status-icon:hover {
      transform: scale(1.2);
    }

    .icon-status-se_DoWgladu  { background: var(--badge-blue-bg);  color: var(--badge-blue-text); }
    .icon-status-se_Zmieniany { background: var(--badge-amber-bg); color: var(--badge-amber-text); }
    .icon-status-se_DoZatw    { background: var(--badge-green-bg); color: var(--badge-green-text); }
    .icon-status-se_Niewidoczny { background: var(--badge-gray-bg); color: var(--badge-gray-text); }
    .icon-status-default      { background: var(--badge-gray-bg);  color: var(--badge-gray-text); }

    .icon-przek-spd_oczek    { background: var(--badge-amber-bg); color: var(--badge-amber-text); }
    .icon-przek-spd_przyj    { background: var(--badge-green-bg); color: var(--badge-green-text); }
    .icon-przek-spd_odrzuc   { background: var(--badge-red-bg, #fee2e2); color: var(--badge-red-text, #b91c1c); }
    .icon-przek-spd_zwrot    { background: var(--badge-amber-bg); color: var(--badge-amber-text); }
    .icon-przek-spd_anulprzek{ background: var(--badge-gray-bg);  color: var(--badge-gray-text); }

    .icon-fin       { background: #fef3c7; color: #92400e; }
    .icon-archiwum  { background: var(--badge-gray-bg); color: var(--badge-gray-text); }
    .icon-publiczny { background: var(--badge-blue-bg); color: var(--badge-blue-text); }

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
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .details-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
      border: 1px solid var(--border-default);
    }

    .details-content::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .detail-section {
      background: var(--bg-subtle);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--border-default);
    }

    .section-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      border-bottom: 2px solid var(--border-default);
      padding-bottom: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 8px 0;
      border-bottom: 1px solid var(--table-row-border);
      gap: 16px;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 14px;
      min-width: 120px;
      flex-shrink: 0;
    }

    .value {
      color: var(--text-primary);
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

    .register {
      font-family: 'Courier New', monospace;
      background: var(--bg-muted);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .contractor {
      font-weight: 500;
    }

    .contractor-type {
      font-size: 12px;
      color: var(--text-muted);
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
      background: var(--bg-surface);
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid var(--border-default);
    }

    .financial-item.total {
      background: linear-gradient(135deg, var(--badge-green-bg), #bbf7d0);
      border-color: #16a34a;
    }

    .financial-label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .financial-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
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
      background: var(--bg-surface);
      border-radius: 8px;
      border: 1px solid var(--border-default);
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
      color: var(--text-primary);
    }

    .attachment-number {
      font-size: 12px;
      color: var(--text-muted);
      font-family: 'Courier New', monospace;
    }

    .expand-indicator {
      margin-left: auto;
      font-size: 12px;
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }

    .attachment-content {
      border-top: 1px solid var(--table-row-border);
      padding: 12px;
      background: var(--bg-subtle);
      animation: slideDown 0.2s ease;
    }

    .loading-attachment {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 14px;
    }

    .loading-spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid var(--border-default);
      border-top: 2px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .attachment-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--text-muted);
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
      background: var(--bg-surface);
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--border-default);
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-primary);
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
    }

    .content-text::-webkit-scrollbar {
      width: 6px;
    }

    .content-text::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 3px;
    }

    .content-text::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
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
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 4px 12px var(--shadow-card);
      color: var(--text-muted);
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

  constructor(private zalacznikiService: ZalacznikiService, private authService: AuthService) {}

  pobierzZalacznik(attachmentNumber: number, fileName: string) {
    if (!this.document) {
      return;
    }

    const sesja = this.authService.getCurrentSession()?.sesja || 0;
    this.zalacznikiService.getZalacznikTresc(sesja, this.document.numer, attachmentNumber).subscribe({
      next: (content) => {
        if (content.tresc) {
          openOrDownloadBase64File(fileName, content.tresc);
        }
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
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

  isValidDate(dateString?: string): boolean {
    if (!dateString) return false;    
    return !!(dateString && dateString !== '1899-12-30T00:00:00.000Z');
  }

  getStatusEdycjiIcon(): string {
    switch (this.document?.statusEdycji) {
      case 'se_DoWgladu':    return '👁';
      case 'se_Zmieniany':   return '✏️';
      case 'se_DoZatw':      return '✅';
      case 'se_Niewidoczny': return '🚫';
      default:               return '📋';
    }
  }

  getStatusEdycjiLabel(): string {
    switch (this.document?.statusEdycji) {
      case 'se_DoWgladu':    return 'Do wglądu';
      case 'se_Zmieniany':   return 'Zmieniany';
      case 'se_DoZatw':      return 'Do zatwierdzenia';
      case 'se_Niewidoczny': return 'Niewidoczny';
      default:               return 'Status edycji';
    }
  }

  getStatusPrzekIcon(): string {
    switch (this.document?.statusPrzek) {
      case 'spd_oczek':     return '⏳';
      case 'spd_przyj':     return '📥';
      case 'spd_odrzuc':    return '❌';
      case 'spd_zwrot':     return '↩️';
      case 'spd_anulprzek': return '🚫';
      default:              return '📤';
    }
  }

  getStatusPrzekLabel(): string {
    switch (this.document?.statusPrzek) {
      case 'spd_oczek':     return 'Oczekuje na przekazanie';
      case 'spd_przyj':     return 'Przyjęty';
      case 'spd_odrzuc':    return 'Odrzucony';
      case 'spd_zwrot':     return 'Zwrócony';
      case 'spd_anulprzek': return 'Anulowane przekazanie';
      default:              return 'Status przekazania';
    }
  }

  getStatusClass(): string {
    return '';
  }

  getTypeClass(typeName: string): string {
    const type = typeName.toLowerCase();
    if (type.includes('faktura')) return 'type-faktura';
    if (type.includes('decyzja')) return 'type-decyzja';
    if (type.includes('postanowienie')) return 'type-postanowienie';
    return 'type-default';
  }
}