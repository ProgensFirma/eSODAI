import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dokument } from '../models/dokument.model';
import { DokumentTyp } from '../models/dokument-typ.model';
import { DokumentTypyService } from '../services/dokument-typy.service';
import { DokumentyService } from '../services/dokumenty.service';
import { TKontrahentInfo } from '../models/typy-info.model';
import { KontrahenciWindowComponent } from './kontrahenci-window.component';
import { WykazAkt } from '../models/wykaz-akt.model';
import { WykazAktService } from '../services/wykaz-akt.service';
import { ZalacznikTresc } from '../models/zalacznik.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';
import { ZalacznikiService } from '../services/zalaczniki.service';

@Component({
  selector: 'app-document-edit-window',
  standalone: true,
  imports: [CommonModule, FormsModule, KontrahenciWindowComponent],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="title-icon">{{ mode === 'add' ? '➕' : '✏️' }}</span>
            {{ mode === 'add' ? 'Nowy dokument' : 'Edycja dokumentu' }}
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

            <div class="form-group">
              <label class="form-label">Typ dokumentu <span class="required">*</span></label>
              <select
                class="form-select"
                [(ngModel)]="selectedTypNazwa"
                (change)="onTypChange()"
                required
              >
                <option value="">-- Wybierz typ --</option>
                <option *ngFor="let typ of dokumentTypy" [value]="typ.nazwa">
                  {{ typ.nazwa }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Nazwa <span class="required">*</span></label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.nazwa"
                placeholder="Wprowadź nazwę dokumentu"
                required
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">Opis</label>
              <textarea
                class="form-textarea"
                [(ngModel)]="dokument.opis"
                placeholder="Wprowadź opis dokumentu"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Rejestr</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.rejestr"
                placeholder="Rejestr"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Nr pozycji rejestru</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.rejestrNrPozycji"
                placeholder="Nr pozycji"
              />
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
                <button class="select-button" type="button" (click)="openKontrahentWindow()">
                  <span class="button-icon">🔍</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Numer na dokumencie</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="dokument.numerNaDok"
                placeholder="Numer z dokumentu"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Data wpływu</label>
              <input
                type="date"
                class="form-input"
                [(ngModel)]="dataWplywuStr"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Godzina wpływu</label>
              <input
                type="time"
                class="form-input"
                [(ngModel)]="godzinaWplywuStr"
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

            <div class="form-group readonly">
              <label class="form-label">GUID</label>
              <input
                type="text"
                class="form-input"
                [value]="dokument.dokGuid"
                readonly
              />
            </div>

            <div class="form-group">
              <label class="form-label">JRWA</label>
              <select class="form-select" [(ngModel)]="selectedJrwa">
                <option value="">-- Wybierz JRWA --</option>
                <option *ngFor="let jrwa of wykazAktList" [value]="jrwa.symbol">
                  {{ jrwa.symbol }} - {{ jrwa.nazwa }}
                </option>
              </select>
            </div>

            <div class="form-group full-width" *ngIf="mode === 'edit' && dokument.zalaczniki && dokument.zalaczniki.length > 0">
              <label class="form-label">Załączniki ({{ dokument.zalaczniki.length }})</label>
              <div class="attachments-list">
                <div class="attachment-item" *ngFor="let zalacznik of dokument.zalaczniki">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ zalacznik.plik }}</span>
                  <span class="attachment-number">#{{ zalacznik.numer }}</span>
                </div>
              </div>
            </div>

            <div class="form-group full-width">
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
          <button class="button button-secondary" (click)="onClose()">
            <span class="button-icon">✕</span>
            Anuluj
          </button>
          <button
            class="button button-primary"
            (click)="onSave()"
            [disabled]="saving || !isFormValid()"
          >
            <span class="button-icon" *ngIf="!saving">💾</span>
            <span class="spinner" *ngIf="saving"></span>
            {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
          </button>
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
      background: rgba(0, 0, 0, 0.5);
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 1400px;
      width: 95%;
      max-height: 95vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
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
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    }

    .modal-title {
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

    .close-button {
      background: transparent;
      border: none;
      font-size: 24px;
      color: #64748b;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #f1f5f9;
      color: #1e293b;
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
      background: #f1f5f9;
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group.readonly .form-input {
      background: #f8fafc;
      color: #64748b;
      cursor: not-allowed;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .required {
      color: #dc2626;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      color: #1e293b;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 60px;
    }

    .form-select:disabled {
      background: #f8fafc;
      color: #94a3b8;
      cursor: not-allowed;
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
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .select-button:not(:disabled):hover {
      background: #cbd5e1;
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
      background: #e2e8f0;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
    }

    .file-select-button:hover {
      background: #cbd5e1;
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
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      max-height: 150px;
      overflow-y: auto;
    }

    .attachments-list::-webkit-scrollbar {
      width: 6px;
    }

    .attachments-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .attachments-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .attachment-item:hover {
      border-color: #cbd5e1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .attachment-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .attachment-name {
      flex: 1;
      font-size: 13px;
      color: #1e293b;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .attachment-number {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      padding: 2px 8px;
      background: #f1f5f9;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
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
      background: white;
      color: #475569;
      border: 1px solid #cbd5e1;
    }

    .button-secondary:hover {
      background: #f1f5f9;
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
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() dokument!: Dokument;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() documentSaved = new EventEmitter<void>();

  dokumentTypy: DokumentTyp[] = [];
  selectedTypNazwa: string = '';
  dataWplywuStr: string = '';
  godzinaWplywuStr: string = '';
  saving = false;
  errorMessage: string = '';
  successMessage: string = '';
  showKontrahentWindow = false;
  wykazAktList: WykazAkt[] = [];
  selectedJrwa: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    private dokumentTypyService: DokumentTypyService,
    private dokumentyService: DokumentyService,
    private wykazAktService: WykazAktService,
    private zalacznikiService: ZalacznikiService
  ) {}

  ngOnInit() {
    this.loadDokumentTypy();
    this.loadWykazAkt();
    this.initializeFormData();

    if (this.mode === 'add') {
      this.loadOsobaRejestr();
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

  initializeFormData() {
    if (this.dokument.typ?.nazwa) {
      this.selectedTypNazwa = this.dokument.typ.nazwa;
    }

    if (this.dokument.jrwa) {
      this.selectedJrwa = this.dokument.jrwa;
    }

    if (this.dokument.dataWplywu && this.dokument.dataWplywu !== '1899-12-30T00:00:00.000Z') {
      const date = new Date(this.dokument.dataWplywu);
      this.dataWplywuStr = date.toISOString().split('T')[0];
    }

    if (this.dokument.godzinaWplywu) {
      const hours = Math.floor(this.dokument.godzinaWplywu / 3600000);
      const minutes = Math.floor((this.dokument.godzinaWplywu % 3600000) / 60000);
      this.godzinaWplywuStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
    return !!(this.selectedTypNazwa && this.dokument.nazwa);
  }

  onSave() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Wypełnij wszystkie wymagane pola';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.dataWplywuStr) {
      this.dokument.dataWplywu = new Date(this.dataWplywuStr).toISOString();
    }

    if (this.godzinaWplywuStr) {
      const [hours, minutes] = this.godzinaWplywuStr.split(':').map(Number);
      this.dokument.godzinaWplywu = (hours * 3600000) + (minutes * 60000);
    }

    if (this.selectedJrwa) {
      this.dokument.jrwa = this.selectedJrwa;
    }

    this.dokumentTypyService.saveDokument(this.dokument).subscribe({
      next: (response) => {
        if (this.selectedFile) {
          this.uploadAttachment(response.numer);
        } else {
          this.saving = false;
          this.successMessage = 'Dokument został pomyślnie zapisany';
          setTimeout(() => {
            this.documentSaved.emit();
            this.onClose();
          }, 1500);
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
      adres: kontrahentInfo.adres
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
          setTimeout(() => {
            this.documentSaved.emit();
            this.onClose();
          }, 1500);
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
}
