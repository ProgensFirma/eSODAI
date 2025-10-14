import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kontrahent-edit-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-overlay" (click)="closeWindow()">
      <div class="edit-window" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">➕</span>
            Nowy kontrahent
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
                    Firma
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

                <div class="form-group" *ngIf="formData.type === 'person'">
                  <label class="form-label">Imię</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.imie"
                    name="imie"
                    placeholder="Imię"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Nazwa</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nazwa"
                    name="nazwa"
                    placeholder="Pełna nazwa"
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
              <h3 class="section-title">Adres stały</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Ulica</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.ulica"
                    name="ulica"
                    placeholder="Nazwa ulicy"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Nr domu</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nrDomu"
                    name="nrDomu"
                    placeholder="00"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Nr lokalu</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="formData.nrLokalu"
                    name="nrLokalu"
                    placeholder="00"
                  />
                </div>

                <div class="form-group">
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

                <div class="form-group">
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
          <button class="button button-save" (click)="saveKontrahent()">
            <span class="button-icon">💾</span>
            Zapisz
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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .edit-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 95vw;
      max-width: 1400px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
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
      background: #f1f5f9;
      border-radius: 4px;
    }

    .window-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .kontrahent-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px 14px;
      border: 1px solid #e2e8f0;
    }

    .form-section.full-width {
      grid-column: 1 / -1;
    }

    .section-title {
      margin: 0 0 10px 0;
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }

    .type-selector {
      display: flex;
      flex-direction: column;
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
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      transition: all 0.2s ease;
    }

    .type-icon {
      font-size: 16px;
    }

    .type-option input[type="radio"]:checked + .type-label {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-color: #2563eb;
      color: #1e40af;
    }

    .type-option:hover .type-label {
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }

    .form-input,
    .form-textarea {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      color: #1e293b;
      background: white;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
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
      background: #e2e8f0;
      color: #475569;
    }

    .button-cancel:hover {
      background: #cbd5e1;
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
export class KontrahentEditWindowComponent {
  @Output() closeRequested = new EventEmitter<void>();
  @Output() kontrahentSaved = new EventEmitter<any>();

  formData = {
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

  closeWindow() {
    this.closeRequested.emit();
  }

  saveKontrahent() {
    if (!this.formData.identyfikator.trim()) {
      alert('Identyfikator jest wymagany');
      return;
    }

    this.kontrahentSaved.emit(this.formData);
    this.closeWindow();
  }
}
