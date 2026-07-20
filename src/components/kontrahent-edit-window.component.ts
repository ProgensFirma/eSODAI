import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KontrahenciService } from '../services/kontrahenci.service';
import { KontrahentDetailed } from '../models/kontrahent.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Component({
  selector: 'app-kontrahent-edit-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-overlay">
      <div class="edit-window" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">{{ isEditMode ? '✏️' : '➕' }}</span>
            {{ isEditMode ? 'Edycja danych' : 'Nowy kontrahent' }}
          </h2>
          <button class="close-button" (click)="closeWindow()" title="Zamknij">
            <span class="close-icon">✕</span>
          </button>
        </div>

        <div class="window-content">
          <form class="kontrahent-form">
            <!-- Typ kontrahenta -->
            <div class="form-section full-width">
              <h3 class="section-title">Typ kontrahenta</h3>
              <div class="type-selector">
                <label class="type-option">
                  <input
                    type="radio"
                    name="type"
                    value="person"
                    [(ngModel)]="formData.type"
                  />
                  <span class="type-label">
                    <span class="type-icon">👤</span>
                    Osoba fizyczna
                  </span>
                </label>
                <label class="type-option">
                  <input
                    type="radio"
                    name="type"
                    value="company"
                    [(ngModel)]="formData.type"
                  />
                  <span class="type-label">
                    <span class="type-icon">🏢</span>
                    Osoba prawna
                  </span>
                </label>
              </div>
            </div>

            <!-- Dane podstawowe -->
            <div class="form-section">
              <h3 class="section-title">Dane podstawowe</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Identyfikator *</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.identyfikator"
                    name="identyfikator"
                    placeholder="np. Jan Kowalski"
                    required
                  />
                </div>

                <div class="form-group form-group-short" *ngIf="formData.type === 'person'">
                  <label class="form-label">Imię</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.imie"
                    name="imie"
                    placeholder="Imię"
                    (ngModelChange)="autoFillIdentyfikator()"
                  />
                </div>

                <div class="form-group" [ngClass]="formData.type === 'person' ? 'form-group-long' : 'full-width'">
                  <label class="form-label">{{ formData.type === 'person' ? 'Nazwisko' : 'Nazwa' }}</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nazwa"
                    name="nazwa"
                    [placeholder]="formData.type === 'person' ? 'Nazwisko' : 'Pełna nazwa'"
                    (ngModelChange)="autoFillIdentyfikator()"
                  />
                </div>
              </div>
            </div>

            <!-- Dane osobowe / firmowe -->
            <div class="form-section" *ngIf="formData.type === 'person'">
              <h3 class="section-title">Dane osobowe</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">PESEL</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.pesel"
                    name="pesel"
                    placeholder="00000000000"
                    maxlength="11"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Data urodzenia</label>
                  <input
                    type="date"
                    class="form-input"
                    [(ngModel)]="formData.dataUrodzenia"
                    name="dataUrodzenia"
                  />
                </div>
              </div>
            </div>

            <div class="form-section" *ngIf="formData.type === 'company'">
              <h3 class="section-title">Dane firmy</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">NIP</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nip"
                    name="nip"
                    placeholder="0000000000"
                    maxlength="10"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">REGON</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.regon"
                    name="regon"
                    placeholder="000000000"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">KRS</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.krs"
                    name="krs"
                    placeholder="0000000000"
                  />
                </div>
              </div>
            </div>

            <!-- Adres -->
            <div class="form-section">
              <h3 class="section-title">Adres główny</h3>
              <div class="address-grid">
                <div class="form-group address-street">
                  <label class="form-label">Ulica</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.ulica"
                    name="ulica"
                    placeholder="Nazwa ulicy"
                  />
                </div>

                <div class="form-group address-short">
                  <label class="form-label">Nr domu</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nrDomu"
                    name="nrDomu"
                    placeholder="00"
                  />
                </div>

                <div class="form-group address-short">
                  <label class="form-label">Nr lokalu</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nrLokalu"
                    name="nrLokalu"
                    placeholder="00"
                  />
                </div>

                <div class="form-group address-postal">
                  <label class="form-label">Kod pocztowy</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.kodPoczta"
                    name="kodPoczta"
                    placeholder="00-000"
                    maxlength="6"
                  />
                </div>

                <div class="form-group address-city">
                  <label class="form-label">Miejscowość</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.miejscowosc"
                    name="miejscowosc"
                    placeholder="Nazwa miejscowości"
                  />
                </div>
              </div>
            </div>

            <!-- Kontakt -->
            <div class="form-section">
              <h3 class="section-title">Dane kontaktowe</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Telefon</label>
                  <input
                    type="tel"
                    class="form-input"
                    [(ngModel)]="formData.telefon"
                    name="telefon"
                    placeholder="+48 000 000 000"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-input"
                    [(ngModel)]="formData.email"
                    name="email"
                    placeholder="email@example.com"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Strona WWW</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.www"
                    name="www"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <!-- Uwagi -->
            <div class="form-section full-width">
              <h3 class="section-title">Dodatkowe informacje</h3>
              <div class="form-group">
                <label class="form-label">Uwagi</label>
                <textarea
                  class="form-textarea"
                  [(ngModel)]="formData.uwagi"
                  name="uwagi"
                  rows="3"
                  placeholder="Dodatkowe informacje o kontrahencie..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="window-footer">
          <button class="button button-cancel" (click)="closeWindow()">
            Anuluj
          </button>
          <button class="button button-save" (click)="saveKontrahent()" [disabled]="saving">
            <span class="button-icon">💾</span>
            {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .edit-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      backdrop-filter: blur(4px);
    }

    .edit-window {
      background: var(--bg-surface);
      border-radius: 16px;
      box-shadow: 0 20px 60px var(--shadow-md);
      width: 95vw;
      max-width: 1400px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: var(--transition-theme);
    }

    .window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: linear-gradient(135deg, #16a34a, #22c55e);
      color: white;
      border-bottom: 1px solid #15803d;
    }

    .window-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }

    .title-icon {
      font-size: 20px;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .window-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    .window-content::-webkit-scrollbar {
      width: 8px;
    }

    .window-content::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }

    .window-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }

    .kontrahent-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-section {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 12px 14px;
      border: 1px solid var(--border-default);
    }

    .form-section.full-width {
      grid-column: 1 / -1;
    }

    .section-title {
      margin: 0 0 10px 0;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-default);
      padding-bottom: 6px;
    }

    .type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .type-option {
      position: relative;
      cursor: pointer;
    }

    .type-option input[type="radio"] {
      position: absolute;
      opacity: 0;
    }

    .type-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--bg-surface);
      border: 2px solid var(--border-default);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .type-icon {
      font-size: 16px;
    }

    .type-option input[type="radio"]:checked + .type-label {
      background: var(--selected-bg);
      border-color: var(--selected-border);
      color: var(--badge-blue-text);
    }

    .type-option:hover .type-label {
      border-color: var(--border-muted);
      transform: translateY(-2px);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .address-grid {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      gap: 10px;
    }

    .address-grid .address-street {
      grid-column: 1;
    }

    .address-grid .address-short {
      grid-column: span 1;
    }

    .address-grid .address-postal {
      grid-column: 1;
    }

    .address-grid .address-city {
      grid-column: 2 / -1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group.form-group-short {
      grid-column: span 1;
    }

    .form-group.form-group-long {
      grid-column: span 2;
    }

    .form-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-input,
    .form-textarea {
      padding: 6px 10px;
      border: 1px solid var(--input-border);
      border-radius: 6px;
      font-size: 13px;
      color: var(--input-text);
      background: var(--input-bg);
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--input-focus-border);
      box-shadow: var(--input-focus-shadow);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .window-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px 20px;
      background: var(--bg-subtle);
      border-top: 1px solid var(--border-default);
    }

    .button {
      border: none;
      border-radius: 6px;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .button-cancel {
      background: var(--border-default);
      color: var(--text-secondary);
    }

    .button-cancel:hover {
      background: var(--border-muted);
    }

    .button-save {
      background: #16a34a;
      color: white;
    }

    .button-save:hover {
      background: #15803d;
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .edit-window {
        width: 95vw;
        max-height: 95vh;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .type-selector {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class KontrahentEditWindowComponent implements OnInit {
  @Input() kontrahent: any = null;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() kontrahentSaved = new EventEmitter<any>();

  isEditMode = false;
  saving = false;

  constructor(private kontrahenciService: KontrahenciService) {}

  formData = {
    numer: 0,
    type: 'person',
    identyfikator: '',
    imie: '',
    nazwa: '',
    pesel: '',
    dataUrodzenia: '',
    nip: '',
    regon: '',
    krs: '',
    ulica: '',
    nrDomu: '',
    nrLokalu: '',
    kodPoczta: '',
    miejscowosc: '',
    telefon: '',
    email: '',
    www: '',
    uwagi: ''
  };

  ngOnInit() {
    if (this.kontrahent) {
      this.isEditMode = true;
      this.formData = { ...this.kontrahent };
      const rawDate = (this.formData.dataUrodzenia || '').substring(0, 10);
      this.formData.dataUrodzenia = rawDate && rawDate !== '1899-12-30' ? rawDate : '';
    }
  }

  closeWindow() {
    this.closeRequested.emit();
  }

  autoFillIdentyfikator() {
    if (this.formData.type !== 'person') return;
    if (this.formData.identyfikator.trim()) return;
    const imie = this.formData.imie.trim();
    const nazwisko = this.formData.nazwa.trim();
    if (imie && nazwisko) {
      this.formData.identyfikator = `${imie} ${nazwisko}`;
    }
  }

  private buildKontrahentBody(): KontrahentDetailed {
    const isCompany = this.formData.type === 'company';
    const sentinel = '1899-12-30T00:00:00.000Z';
    const rawDate = this.formData.dataUrodzenia || '';
    const dataUrodzenia = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && rawDate !== '1899-12-30'
      ? `${rawDate}T00:00:00.000Z`
      : sentinel;
    return {
      numer: this.formData.numer || 0,
      archiwum: false,
      identyfikator: this.formData.identyfikator,
      nazwa: this.formData.nazwa,
      imie: isCompany ? '' : this.formData.imie,
      imie2: '',
      imieOjca: '',
      imieMatki: '',
      dataUrodzenia: isCompany ? sentinel : dataUrodzenia,
      dataZgonu: sentinel,
      firma: isCompany,
      grupa: '',
      pesel: this.formData.pesel || '',
      nip: this.formData.nip || '',
      regon: this.formData.regon || '',
      kRS: this.formData.krs || '',
      odID: '',
      kontakt: {
        telefon: this.formData.telefon || '',
        telefon2: '',
        email: this.formData.email || '',
        wWW: this.formData.www || '',
        epuapAdres: '',
        eDoreczAdres: '',
        sMSZgoda: false,
        emailZgoda: false,
        pushZgoda: false
      },
      opis: '',
      nazwaDluga: '',
      uwagi: this.formData.uwagi || '',
      adresStaly: {
        kraj: 'Polska',
        woj: '',
        powiat: '',
        gmina: '',
        ulicaTyp: '',
        typ: 'ta_zamieszkania',
        kodPoczta: this.formData.kodPoczta || '',
        poczta: '',
        miejscowosc: this.formData.miejscowosc || '',
        ulica: this.formData.ulica || '',
        nrDomu: this.formData.nrDomu || '',
        nrLokalu: this.formData.nrLokalu || ''
      },
      adresKoresp: {
        kraj: 'Polska',
        woj: '',
        powiat: '',
        gmina: '',
        ulicaTyp: '',
        typ: 'ta_koresp',
        kodPoczta: this.formData.kodPoczta || '',
        poczta: '',
        miejscowosc: this.formData.miejscowosc || '',
        ulica: this.formData.ulica || '',
        nrDomu: this.formData.nrDomu || '',
        nrLokalu: this.formData.nrLokalu || ''
      },
      oper: this.isEditMode ? TBazaOper.tboZmien : TBazaOper.tboDodaj,
      status: TeSodStatus.sBrak,
      statusDane: ''
    };
  }

  saveKontrahent() {
    if (this.formData.type === 'person' && !this.formData.identyfikator.trim()) {
      const imie = this.formData.imie.trim();
      const nazwisko = this.formData.nazwa.trim();
      if (imie && nazwisko) {
        this.formData.identyfikator = `${imie} ${nazwisko}`;
      }
    }

    if (!this.formData.identyfikator.trim()) {
      alert('Identyfikator jest wymagany');
      return;
    }

    this.saving = true;
    const body = this.buildKontrahentBody();
    const request$ = this.isEditMode
      ? this.kontrahenciService.updateKontrahent(body)
      : this.kontrahenciService.addKontrahent(body);

    request$.subscribe({
      next: (response) => {
        this.saving = false;
        const saved: KontrahentDetailed = (response && typeof response === 'object')
          ? { ...body, ...response }
          : body;
        this.kontrahentSaved.emit(saved);
        this.closeWindow();
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}
