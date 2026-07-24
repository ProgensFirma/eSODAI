import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dokument } from '../models/dokument.model';
import { DokumentTyp } from '../models/dokument-typ.model';
import { DokumentTypyService } from '../services/dokument-typy.service';
import { DokumentyService } from '../services/dokumenty.service';
import { TKontrahentInfo, TZalacznikInfo } from '../models/typy-info.model';
import { KontrahenciWindowComponent } from './kontrahenci-window.component';
import { WykazAkt } from '../models/wykaz-akt.model';
import { WykazAktService } from '../services/wykaz-akt.service';
import { ZalacznikTresc } from '../models/zalacznik.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';
import { ZalacznikiService } from '../services/zalaczniki.service';
import { AuthService } from '../services/auth.service';
import { openOrDownloadBase64File } from '../functions/fun-zalacznikow';

@Component({
  selector: 'app-document-edit-window',
  standalone: true,
  imports: [CommonModule, FormsModule, KontrahenciWindowComponent],
  template: `
    <div class="modal-overlay">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">{{ mode === 'add' ? '➕' : (mode === 'readonly' ? '📄' : '✏️') }}</span>
            {{ mode === 'add' ? 'Nowy dokument' : (mode === 'readonly' ? 'Dokument' : 'Edycja dokumentu') }}
          </h2>
          <button class="close-button" (click)="onClose()">✕</button>
        </div>

        <div class="modal-content">
          <div class="form-grid">
            <div class="form-group readonly">
              <label class="form-label">Numer</label>
              <input
                type="text"
                class="form-input"
                [value]="dokument.numer"
                readonly
              />
            </div>

            <div class="form-group" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Typ dokumentu <span class="required" *ngIf="mode !== 'readonly'">*</span></label>
              <select
                class="form-select"
                [(ngModel)]="selectedTypNazwa"
                (change)="onTypChange()"
                [disabled]="mode === 'readonly'"
                required
              >
                <option value="">-- Wybierz typ --</option>
                <option *ngFor="let typ of dokumentTypy" [value]="typ.nazwa">
                  {{ typ.nazwa }}
                </option>
              </select>
            </div>

            <div class="form-group full-width" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Nazwa <span class="required" *ngIf="mode !== 'readonly'">*</span></label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.nazwa"
                [readonly]="mode === 'readonly'"
                placeholder="Wprowadź nazwę dokumentu"
                required
              />
            </div>

            <div class="form-group full-width" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Opis</label>
              <textarea
                class="form-textarea"
                [(ngModel)]="dokument.opis"
                [readonly]="mode === 'readonly'"
                placeholder="Wprowadź opis dokumentu"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Rejestr</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.rejestr"
                [readonly]="mode === 'readonly'"
                placeholder="Rejestr"
              />
            </div>

            <div class="form-group" [class.success-field]="documentSavedSuccessfully && mode === 'add'" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Nr pozycji rejestru</label>
              <div class="input-with-button" *ngIf="documentSavedSuccessfully && mode === 'add'; else normalInput">
                <input
                  type="text"
                  class="form-input"
                  [value]="dokument.rejestrNrPozycji"
                  readonly
                />
                <button class="copy-button" type="button" (click)="copyToClipboard(dokument.rejestrNrPozycji)" title="Kopiuj">
                  <span class="button-icon">📋</span>
                </button>
              </div>
              <ng-template #normalInput>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="dokument.rejestrNrPozycji"
                  [readonly]="mode === 'readonly'"
                  placeholder="Nr pozycji"
                />
              </ng-template>
            </div>

            <div class="form-group kontrahent-group">
              <label class="form-label">Kontrahent</label>
              <div class="input-with-button">
                <input
                  type="text"
                  class="form-input"
                  [value]="dokument.kontrahent.identyfikator || ''"
                  readonly
                  placeholder="Wybierz kontrahenta"
                />
                <button *ngIf="mode !== 'readonly'" class="select-button" type="button" (click)="openKontrahentWindow()">
                  <span class="button-icon">🔍</span>
                </button>
              </div>
            </div>

            <div class="form-group" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Numer na dokumencie</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.numerNaDok"
                [readonly]="mode === 'readonly'"
                placeholder="Numer z dokumentu"
              />
            </div>

            <div class="form-group" [class.readonly]="mode === 'readonly'">
              <label class="form-label">Data i czas wpływu</label>
              <input
                type="datetime-local"
                class="form-input"
                [(ngModel)]="dataCzasWplywuStr"
                [disabled]="mode === 'readonly'"
              />
            </div>

            <div class="form-group readonly">
              <label class="form-label">Odpowiedzialny</label>
              <input
                type="text"
                class="form-input"
                [value]="dokument.odpowiedzialny?.identyfikator || ''"
                readonly
              />
            </div>

            <div class="form-group span-2 readonly" [class.success-field]="documentSavedSuccessfully && mode === 'add'">
              <label class="form-label">GUID</label>
              <div class="input-with-button" *ngIf="documentSavedSuccessfully && mode === 'add'; else normalGuid">
                <input
                  type="text"
                  class="form-input"
                  [value]="dokument.dokGuid"
                  readonly
                />
                <button class="copy-button" type="button" (click)="copyToClipboard(dokument.dokGuid)" title="Kopiuj">
                  <span class="button-icon">📋</span>
                </button>
              </div>
              <ng-template #normalGuid>
                <input
                  type="text"
                  class="form-input"
                  [value]="dokument.dokGuid"
                  readonly
                />
              </ng-template>
            </div>

            <div class="form-group" [class.readonly]="mode === 'readonly'">
              <label class="form-label">JRWA</label>
              <select class="form-select" [(ngModel)]="selectedJrwa" [disabled]="mode === 'readonly'">
                <option value="">-- Wybierz JRWA --</option>
                <option *ngFor="let jrwa of wykazAktList" [value]="jrwa.symbol">
                  {{ jrwa.symbol }} - {{ jrwa.nazwa }}
                </option>
              </select>
            </div>

            <div class="form-group full-width" *ngIf="(mode === 'edit' || mode === 'readonly') && dokument.zalaczniki && dokument.zalaczniki.length > 0">
              <label class="form-label">Załączniki ({{ dokument.zalaczniki.length }})</label>
              <div class="attachments-list">
                <div class="attachment-item clickable" *ngFor="let zalacznik of dokument.zalaczniki" (click)="onAttachmentClick(zalacznik)">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ zalacznik.plik }}</span>
                  <span class="attachment-number">#{{ zalacznik.numer }}</span>
                  <span class="attachment-view-icon" *ngIf="!previewLoading[zalacznik.numer]">👁️</span>
                  <span class="spinner" *ngIf="previewLoading[zalacznik.numer]"></span>
                </div>
              </div>
            </div>

            <div class="form-group full-width" *ngIf="mode !== 'readonly'">
              <label class="form-label">{{ mode === 'edit' ? 'Dodaj nowy załącznik' : 'Załącznik' }}</label>
              <div class="file-input-wrapper">
                <input
                  type="file"
                  #fileInput
                  class="file-input"
                  (change)="onFileSelected($event)"
                  accept="*/*"
                />
                <button class="file-select-button" type="button" (click)="fileInput.click()">
                  <span class="button-icon">📄</span>
                  {{ selectedFileName || 'Wybierz plik' }}
                </button>
                <button
                  *ngIf="selectedFileName"
                  class="file-clear-button"
                  type="button"
                  (click)="clearFile()"
                >
                  <span class="button-icon">✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            *ngIf="mode === 'readonly'"
            class="button button-primary"
            (click)="onClose()"
          >
            <span class="button-icon">🚪</span>
            Wyjście
          </button>
          <ng-container *ngIf="mode !== 'readonly'">
            <button
              *ngIf="!documentSavedSuccessfully"
              class="button button-secondary"
              (click)="onClose()"
            >
              <span class="button-icon">✕</span>
              Anuluj
            </button>
            <button
              *ngIf="!documentSavedSuccessfully"
              class="button button-primary"
              (click)="onSave()"
              [disabled]="saving || !isFormValid()"
            >
              <span class="button-icon" *ngIf="!saving">💾</span>
              <span class="spinner" *ngIf="saving"></span>
              {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
            </button>
            <button
              *ngIf="documentSavedSuccessfully"
              class="button button-primary"
              (click)="onClose()"
            >
              <span class="button-icon">🚪</span>
              Wyjście
            </button>
          </ng-container>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          <span class="error-icon">⚠️</span>
          {{ errorMessage }}
        </div>

        <div class="success-message" *ngIf="successMessage">
          <span class="success-icon">✓</span>
          {{ successMessage }}
        </div>
      </div>

      <app-kontrahenci-window
        *ngIf="showKontrahentWindow"
        [pWybor]="true"
        (closeRequested)="closeKontrahentWindow()"
        (kontrahentSelected)="onKontrahentSelected($event)"
      ></app-kontrahenci-window>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-window {
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: 0 20px 60px var(--shadow-md);
      max-width: 1400px;
      width: 95%;
      max-height: 95vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
      transition: var(--transition-theme);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-default);
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
    }

    .modal-title {
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

    .close-button {
      background: transparent;
      border: none;
      font-size: 24px;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
    }

    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 12px 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group.span-2 {
      grid-column: span 2;
    }

    .form-group.readonly .form-input {
      background: var(--bg-subtle);
      color: var(--text-muted);
      cursor: not-allowed;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .required {
      color: #dc2626;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 8px 12px;
      border: 1px solid var(--input-border);
      border-radius: 6px;
      font-size: 14px;
      color: var(--input-text);
      transition: all 0.2s ease;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .form-textarea {
      resize: vertical;
      min-height: 60px;
    }

    .form-select {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .form-select:disabled {
      background: var(--bg-subtle);
      color: var(--text-faint);
      cursor: not-allowed;
    }

    .form-select option {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .kontrahent-group .input-with-button {
      display: flex;
      gap: 8px;
    }

    .kontrahent-group .form-input {
      flex: 1;
    }

    .select-button {
      padding: 8px 14px;
      background: var(--border-default);
      border: 1px solid var(--input-border);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .select-button:not(:disabled):hover {
      background: var(--border-muted);
    }

    .select-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .select-button:not(:disabled) {
      background: #2563eb;
      color: white;
    }

    .select-button:not(:disabled):hover {
      background: #1d4ed8;
    }

    .copy-button {
      padding: 8px 14px;
      background: #10b981;
      border: 1px solid #059669;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .copy-button:hover {
      background: #059669;
      transform: scale(1.05);
    }

    .copy-button:active {
      transform: scale(0.95);
    }

    .success-field {
      animation: highlightField 0.5s ease;
    }

    @keyframes highlightField {
      0%, 100% { background: transparent; }
      50% { background: #f0fdf4; border-radius: 6px; }
    }

    .success-field .input-with-button {
      display: flex;
      gap: 8px;
    }

    .success-field .form-input {
      flex: 1;
      background: #f0fdf4;
      border-color: #86efac;
      font-weight: 600;
      color: #166534;
    }

    .button-icon {
      font-size: 16px;
    }

    .file-input-wrapper {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .file-input {
      display: none;
    }

    .file-select-button {
      flex: 1;
      padding: 12px 16px;
      background: var(--border-default);
      border: 1px solid var(--input-border);
      border-radius: 8px;
      font-size: 14px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
    }

    .file-select-button:hover {
      background: var(--border-muted);
    }

    .file-clear-button {
      padding: 12px 16px;
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
    }

    .file-clear-button:hover {
      background: #fecaca;
    }

    .attachments-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      max-height: 150px;
      overflow-y: auto;
    }

    .attachments-list::-webkit-scrollbar {
      width: 6px;
    }

    .attachments-list::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 3px;
    }

    .attachments-list::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 3px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .attachment-item.clickable {
      cursor: pointer;
    }

    .attachment-item.clickable:hover {
      border-color: #2563eb;
      background: var(--bg-subtle);
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15);
    }

    .attachment-view-icon {
      font-size: 16px;
      flex-shrink: 0;
      margin-left: auto;
    }

    .attachment-preview {
      position: relative;
      border: 1px solid var(--border-default);
      border-radius: 8px;
      background: var(--bg-surface);
      max-height: 400px;
      overflow: auto;
      padding: 16px;
    }

    .preview-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--bg-surface);
      border: 1px solid var(--input-border);
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
      z-index: 10;
      transition: all 0.2s ease;
    }

    .preview-close:hover {
      background: var(--bg-muted);
    }

    .preview-content {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 200px;
    }

    .preview-image {
      max-width: 100%;
      max-height: 360px;
      object-fit: contain;
      border-radius: 4px;
    }

    .preview-iframe {
      width: 100%;
      height: 360px;
      border: none;
      border-radius: 4px;
    }

    .preview-text {
      width: 100%;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 13px;
      color: var(--text-primary);
      margin: 0;
      padding: 8px;
      background: var(--bg-subtle);
      border-radius: 4px;
      max-height: 360px;
      overflow: auto;
    }

    .attachment-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .attachment-name {
      flex: 1;
      font-size: 13px;
      color: var(--text-primary);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .attachment-number {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      padding: 2px 8px;
      background: var(--bg-muted);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--border-default);
      background: var(--bg-subtle);
    }

    .button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .button-secondary {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border: 1px solid var(--input-border);
    }

    .button-secondary:hover {
      background: var(--bg-muted);
    }

    .button-primary {
      background: #2563eb;
      color: white;
    }

    .button-primary:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .button-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message,
    .success-message {
      margin: 12px 24px;
      padding: 10px 14px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .error-message {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .success-message {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .error-icon,
    .success-icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .modal-window {
        width: 95%;
        max-height: 95vh;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .modal-header,
      .modal-content,
      .modal-footer {
        padding: 20px 24px;
      }

      .modal-title {
        font-size: 18px;
      }
    }
  `]
})
export class DocumentEditWindowComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'readonly' = 'add';
  @Input() dokument!: Dokument;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() documentSaved = new EventEmitter<void>();

  dokumentTypy: DokumentTyp[] = [];
  selectedTypNazwa: string = '';
  dataCzasWplywuStr: string = '';
  saving = false;
  errorMessage: string = '';
  successMessage: string = '';
  showKontrahentWindow = false;
  wykazAktList: WykazAkt[] = [];
  selectedJrwa: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  documentSavedSuccessfully = false;
  previewLoading: { [key: number]: boolean } = {};

  constructor(
    private dokumentTypyService: DokumentTypyService,
    private dokumentyService: DokumentyService,
    private wykazAktService: WykazAktService,
    private zalacznikiService: ZalacznikiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDokumentTypy();
    this.loadWykazAkt();
    this.initializeFormData();

    if (this.mode === 'add') {
      this.loadOsobaRejestr();
      this.initializeUprawPoziom();
    }
  }

  loadDokumentTypy() {
    this.dokumentTypyService.getDokumentTypy().subscribe({
      next: (typy) => {
        this.dokumentTypy = typy;
      },
      error: (error) => {
        console.error('Error loading document types:', error);
        this.errorMessage = 'Nie udało się załadować typów dokumentów';
      }
    });
  }

  loadWykazAkt() {
    this.wykazAktService.getWykazAkt().subscribe({
      next: (wykazAkt) => {
        this.wykazAktList = wykazAkt;
      },
      error: (error) => {
        console.error('Error loading wykaz akt:', error);
      }
    });
  }

  loadOsobaRejestr() {
    this.dokumentyService.getOsobaRejestr().subscribe({
      next: (response) => {
        this.dokument.rejestr = response.Rejestr;
      },
      error: (error) => {
        console.error('Error loading osoba rejestr:', error);
        this.dokument.rejestr = 'RPP';
      }
    });
  }

  initializeUprawPoziom() {
    const session = this.authService.getCurrentSession();
    if (session && session.poziom) {
      this.dokument.uprawPoziom = session.poziom;
    }
  }

  initializeFormData() {
    if (this.dokument.typ?.nazwa) {
      this.selectedTypNazwa = this.dokument.typ.nazwa;
    }

    if (this.dokument.jrwa) {
      this.selectedJrwa = this.dokument.jrwa;
    }

    if (this.dokument.dataCzasWplywu && this.dokument.dataCzasWplywu !== '1899-12-30T00:00:00.000Z') {
      const date = new Date(this.dokument.dataCzasWplywu);
      const pad = (n: number) => n.toString().padStart(2, '0');
      this.dataCzasWplywuStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
  }

  onTypChange() {
    const selectedTyp = this.dokumentTypy.find(t => t.nazwa === this.selectedTypNazwa);
    if (selectedTyp) {
      this.dokument.typ = {
        nazwa: selectedTyp.nazwa,
        finansowy: selectedTyp.finansowy,
        poleceniezaplaty: selectedTyp.polecenieZaplaty
      };

      if (selectedTyp.nazwaDomysl) {
        this.dokument.nazwa = selectedTyp.nazwaDomysl;
      } else if (!this.dokument.nazwa) {
        this.dokument.nazwa = selectedTyp.nazwa;
      }
    }
  }

  isFormValid(): boolean {
    return !!(this.selectedTypNazwa && this.dokument.nazwa && this.dataCzasWplywuStr);
  }

  onSave() {
    if (!this.isFormValid()) {
      this.errorMessage = !this.dataCzasWplywuStr
        ? 'Uzupełnij datę wpływu'
        : 'Wypełnij wszystkie wymagane pola';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.dataCzasWplywuStr) {
      this.dokument.dataCzasWplywu = new Date(this.dataCzasWplywuStr).toISOString();
    }

    if (this.selectedJrwa) {
      this.dokument.jrwa = this.selectedJrwa;
    }

    this.dokumentTypyService.saveDokument(this.dokument).subscribe({
      next: (response) => {
        this.dokument.rejestrNrPozycji = response.rejestrNrPozycji;
        this.dokument.dokGuid = response.dokGuid;

        if (this.selectedFile) {
          this.uploadAttachment(response.numer);
        } else {
          this.saving = false;
          this.successMessage = 'Dokument został pomyślnie zapisany';

          if (this.mode === 'add') {
            this.documentSavedSuccessfully = true;
          } else {
            setTimeout(() => {
              this.documentSaved.emit();
              this.onClose();
            }, 1500);
          }
        }
      },
      error: (error) => {
        this.saving = false;
        console.error('Error saving document:', error);
        this.errorMessage = 'Nie udało się zapisać dokumentu. Spróbuj ponownie.';
      }
    });
  }

  onClose() {
    this.closeRequested.emit();
  }

  onAttachmentClick(zalacznik: TZalacznikInfo) {
    if (this.previewLoading[zalacznik.numer]) return;
    this.previewLoading[zalacznik.numer] = true;

    const session = this.authService.getCurrentSession();
    if (!session?.sesja) {
      this.previewLoading[zalacznik.numer] = false;
      this.errorMessage = 'Brak sesji — nie można pobrać załącznika';
      return;
    }

    this.zalacznikiService.getZalacznikTresc(session.sesja, this.dokument.numer, zalacznik.numer)
      .subscribe({
        next: (tresc) => {
          this.previewLoading[zalacznik.numer] = false;
          if (tresc.tresc) {
            openOrDownloadBase64File(zalacznik.plik, tresc.tresc);
          }
        },
        error: (err) => {
          this.previewLoading[zalacznik.numer] = false;
          console.error('Error loading attachment:', err);
          this.errorMessage = 'Nie udało się pobrać załącznika';
        }
      });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  openKontrahentWindow() {
    this.showKontrahentWindow = true;
  }

  closeKontrahentWindow() {
    this.showKontrahentWindow = false;
  }

  onKontrahentSelected(kontrahentInfo: TKontrahentInfo) {
    this.dokument.kontrahent = {
      numer: kontrahentInfo.numer,
      identyfikator: kontrahentInfo.identyfikator,
      firma: kontrahentInfo.firma,
      nip: kontrahentInfo.nip,
      adres: kontrahentInfo.adres,
      eDoreczAdres: kontrahentInfo.eDoreczAdres
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  private uploadAttachment(dokumentNumer: number) {
    if (!this.selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Content = (reader.result as string).split(',')[1];

      const zalacznik: ZalacznikTresc = {
        numer: 0,
        plik: this.selectedFile!.name,
        dokument: dokumentNumer,
        kolejnosc: 1,
        archiuwum: false,
        data: new Date().toISOString(),
        edycja: false,
        wersja: 0,
        wersjaOpis: '',
        tresc: base64Content,
        
        oper: TBazaOper.tboSelect,
        status: TeSodStatus.sBrak,
        statusDane: ''
      };

      this.zalacznikiService.uploadZalacznik(zalacznik).subscribe({
        next: () => {
          this.saving = false;
          this.successMessage = 'Dokument i załącznik zostały pomyślnie zapisane';

          if (this.mode === 'add') {
            this.documentSavedSuccessfully = true;
          } else {
            setTimeout(() => {
              this.documentSaved.emit();
              this.onClose();
            }, 1500);
          }
        },
        error: (error) => {
          this.saving = false;
          console.error('Error uploading attachment:', error);
          this.errorMessage = 'Dokument zapisany, ale nie udało się dodać załącznika';
        }
      });
    };

    reader.onerror = () => {
      this.saving = false;
      this.errorMessage = 'Nie udało się odczytać pliku';
    };

    reader.readAsDataURL(this.selectedFile);
  }

  copyToClipboard(text: string | undefined) {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const originalMessage = this.successMessage;
      this.successMessage = 'Skopiowano do schowka';
      setTimeout(() => {
        this.successMessage = originalMessage;
      }, 2000);
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
      this.errorMessage = 'Nie udało się skopiować do schowka';
    });
  }
}
