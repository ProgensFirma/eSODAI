import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sprawa } from '../models/sprawa.model';
import { TSprawaTyp } from '../models/sprawa-typ.model';
import { TOsobaInfo, TJednostka, TKontrahentInfo } from '../models/typy-info.model';
import { SprawaTypyService } from '../services/sprawa-typy.service';
import { JednostkiService } from '../services/jednostki.service';
import { PracownicyService } from '../services/pracownicy.service';
import { WykazAktService } from '../services/wykaz-akt.service';
import { SprawyService } from '../services/sprawy.service';
import { AuthService } from '../services/auth.service';
import { WykazAkt } from '../models/wykaz-akt.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';
import { KontrahenciWindowComponent } from './kontrahenci-window.component';

@Component({
  selector: 'app-sprawa-edit-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KontrahenciWindowComponent
  ],
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="onClose()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ sprawa.numer ? 'Edycja sprawy' : 'Nowa sprawa' }}</h2>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-container">
        <div class="field">
          <label for="typSprawy">Typ Sprawy</label>
          <select class="form-select" [(ngModel)]="selectedTypSprawyId" (change)="onTypSprawyChange()">
            <option [value]="null">Wybierz typ sprawy</option>
            <option *ngFor="let typSprawy of sprawyTypy" [value]="typSprawy.typ">
              {{ typSprawy.typ }}{{ typSprawy.rWA ? ' - RWA: ' + typSprawy.rWA : '' }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="nazwa">Nazwa</label>
          <input
            id="nazwa"
            [(ngModel)]="sprawa.nazwa"
            type="text"
            class="form-input" />
        </div>

        <div class="field">
          <label for="kontrahent">Kontrahent</label>
          <div class="kontrahent-select">
            <input
              id="kontrahent"
              [value]="sprawa.kontrahent.identyfikator || ''"
              type="text"
              readonly
              class="form-input"
              placeholder="Wybierz kontrahenta" />
            <button class="btn btn-icon" (click)="openKontrahentWindow()">
              <span class="icon-search">🔍</span>
            </button>
          </div>
        </div>

        <div class="field-group">
          <div class="field">
            <label for="znakSprawy">Znak sprawy</label>
            <input
              id="znakSprawy"
              [(ngModel)]="sprawa.znakSprawy"
              type="text"
              readonly
              class="form-input" />
          </div>

          <div class="field">
            <label for="znakRWA">RWA</label>
            <select class="form-select" [(ngModel)]="selectedRWAId">
              <option [value]="null">Wybierz RWA</option>
              <option *ngFor="let rwa of wykazyAkt" [value]="rwa.symbol">{{ rwa.symbol }} - {{ rwa.nazwa }}</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <div class="field">
            <label for="dataStart">Rozpoczęcie</label>
            <input
              type="date"
              id="dataStart"
              [(ngModel)]="dataStartModel"
              class="form-input" />
          </div>

          <div class="field">
            <label for="dataStop">Zakończenie</label>
            <input
              type="date"
              id="dataStop"
              [(ngModel)]="dataStopModel"
              class="form-input" />
          </div>
        </div>

        <div class="field-group">
          <div class="field">
            <label for="terminPlan">Planowane zakończenie</label>
            <input
              type="date"
              id="terminPlan"
              [(ngModel)]="terminPlanModel"
              class="form-input" />
          </div>

          <div class="field">
            <label for="terminAlarm">Alarmowanie od daty</label>
            <input
              type="date"
              id="terminAlarm"
              [(ngModel)]="terminAlarmModel"
              class="form-input" />
          </div>
        </div>

        <div class="section-row">
          <div class="section-panel">
            <h3>Nadzorujący sprawę</h3>

            <div class="field">
              <label for="nadzorJednostka">Jednostka nadzorująca</label>
              <select class="form-select" [(ngModel)]="selectedNadzorJednostkaId" (change)="onNadzorJednostkaChange()">
                <option [value]="null">Wybierz jednostkę</option>
                <option *ngFor="let jedn of jednostki" [value]="jedn.symbol">{{ jedn.nazwa }}</option>
              </select>
            </div>

            <div class="field">
              <label for="nadzorPracownik">Pracownik</label>
              <select class="form-select" [(ngModel)]="selectedNadzorPracownikId">
                <option [value]="null">Wybierz pracownika</option>
                <option *ngFor="let prac of nadzorPracownicy" [value]="prac.numer">{{ prac.identyfikator }}</option>
              </select>
            </div>
          </div>

          <div class="section-panel">
            <h3>Wykonujący sprawę</h3>

            <div class="field">
              <label for="wykJednostka">Jednostka wykonująca</label>
              <select class="form-select" [(ngModel)]="selectedWykJednostkaId" (change)="onWykJednostkaChange()">
                <option [value]="null">Wybierz jednostkę</option>
                <option *ngFor="let jedn of jednostki" [value]="jedn.symbol">{{ jedn.nazwa }}</option>
              </select>
            </div>

            <div class="field">
              <label for="wykPracownik">Pracownik</label>
              <select class="form-select" [(ngModel)]="selectedWykPracownikId">
                <option [value]="null">Wybierz pracownika</option>
                <option *ngFor="let prac of wykPracownicy" [value]="prac.numer">{{ prac.identyfikator }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label for="opis">Opis</label>
          <textarea
            id="opis"
            [(ngModel)]="sprawa.opis"
            rows="4"
            class="form-textarea">
          </textarea>
        </div>

        <div class="documents-panel" [class.disabled]="!sprawaCreated">
          <h3>Dokumenty sprawy</h3>
          <div class="documents-buttons">
            <button
              class="btn btn-primary"
              [disabled]="!sprawaCreated"
              (click)="attachDocument()">
              ➕ Dołącz dokument
            </button>
            <button
              class="btn btn-secondary"
              [disabled]="!sprawaCreated"
              (click)="detachDocument()">
              ➖ Odłącz dokument
            </button>
          </div>
        </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            *ngIf="!sprawaCreated"
            class="btn btn-primary"
            (click)="save()">
            ✓ Zapisz
          </button>
          <button
            *ngIf="!sprawaCreated"
            class="btn btn-secondary"
            (click)="onClose()">
            ✕ Anuluj
          </button>
          <button
            *ngIf="sprawaCreated"
            class="btn btn-primary"
            (click)="onClose()">
            ✕ Wyjście
          </button>
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
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-window {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 900px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #212529;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      padding: 1rem 1.5rem;
      border-top: 1px solid #dee2e6;
      background-color: #f8f9fa;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-weight: 600;
      font-size: 0.875rem;
      color: #495057;
    }

    .field-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-input[readonly] {
      background-color: #e9ecef;
      cursor: not-allowed;
    }

    .form-select {
      cursor: pointer;
      background-color: white;
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .kontrahent-select {
      display: flex;
      gap: 0.5rem;
    }

    .kontrahent-select input {
      flex: 1;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-icon {
      padding: 0.5rem;
      min-width: 2.5rem;
    }

    .icon-search {
      font-size: 1rem;
    }

    .section-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .section-panel {
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: #f8f9fa;
    }

    .section-panel h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #495057;
    }

    .documents-panel {
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: #f8f9fa;
    }

    .documents-panel.disabled {
      opacity: 0.5;
      background-color: #e9ecef;
    }

    .documents-panel h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #495057;
    }

    .documents-buttons {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class SprawaEditWindowComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() sprawa: Sprawa = this.getEmptySprawa();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() sprawaSaved = new EventEmitter<void>();

  sprawyTypy: TSprawaTyp[] = [];
  jednostki: TJednostka[] = [];
  wykazyAkt: WykazAkt[] = [];
  nadzorPracownicy: TOsobaInfo[] = [];
  wykPracownicy: TOsobaInfo[] = [];

  selectedTypSprawyId: string | null = null;
  selectedRWAId: string | null = null;
  selectedNadzorJednostkaId: string | null = null;
  selectedNadzorPracownikId: number | null = null;
  selectedWykJednostkaId: string | null = null;
  selectedWykPracownikId: number | null = null;

  dataStartModel: string = '';
  dataStopModel: string = '';
  terminPlanModel: string = '';
  terminAlarmModel: string = '';

  sprawaCreated: boolean = false;
  showKontrahentWindow = false;

  constructor(
    private sprawaTypyService: SprawaTypyService,
    private jednostkiService: JednostkiService,
    private pracownicyService: PracownicyService,
    private wykazAktService: WykazAktService,
    private sprawyService: SprawyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const session = this.authService.getCurrentSession();
    if (!session) return;

    this.sprawaTypyService.getSprawaTypy(session.sesja.toString()).subscribe({
      next: (typy) => {
        console.log('Loaded sprawa types:', typy);
        this.sprawyTypy = typy;
      },
      error: (err) => console.error('Error loading sprawa types:', err)
    });

    this.jednostkiService.getJednostki().subscribe({
      next: (jednostki) => {
        this.jednostki = jednostki;
      },
      error: (err) => console.error('Error loading jednostki:', err)
    });

    this.wykazAktService.getWykazAkt().subscribe({
      next: (wykazy) => {
        this.wykazyAkt = wykazy;
      },
      error: (err) => console.error('Error loading wykazy akt:', err)
    });
  }

  onTypSprawyChange() {
    if (this.selectedTypSprawyId) {
      const selectedTyp = this.sprawyTypy.find(t => t.typ === this.selectedTypSprawyId);
      if (selectedTyp) {
        this.sprawa.typ = {
          nazwa: selectedTyp.typ,
          rWA: selectedTyp.rWA
        };

        if (!this.sprawa.nazwa || this.sprawa.nazwa.trim() === '') {
          this.sprawa.nazwa = selectedTyp.typ;
        }

        const today = new Date();
        today.setHours(12, 0, 0, 0);
        this.dataStartModel = today.toISOString().split('T')[0];
        this.sprawa.dataStart = today.toISOString();

        const planDate = new Date(today);
        planDate.setDate(planDate.getDate() + 21);
        this.terminPlanModel = planDate.toISOString().split('T')[0];
        this.sprawa.terminPlan = planDate.toISOString();

        const alarmDate = new Date(planDate);
        alarmDate.setDate(alarmDate.getDate() - 3);
        this.terminAlarmModel = alarmDate.toISOString().split('T')[0];
        this.sprawa.terminAlarm = alarmDate.toISOString();
      }
    }
  }

  onNadzorJednostkaChange() {
    if (!this.selectedNadzorJednostkaId) return;

    const session = this.authService.getCurrentSession();
    if (!session) return;

    this.pracownicyService.getPracownicy(session.sesja.toString()).subscribe({
      next: (pracownicy) => {
        this.nadzorPracownicy = pracownicy;
      },
      error: (err) => console.error('Error loading nadzor pracownicy:', err)
    });
  }

  onWykJednostkaChange() {
    if (!this.selectedWykJednostkaId) return;

    const session = this.authService.getCurrentSession();
    if (!session) return;

    this.pracownicyService.getPracownicy(session.sesja.toString()).subscribe({
      next: (pracownicy) => {
        this.wykPracownicy = pracownicy;
      },
      error: (err) => console.error('Error loading wyk pracownicy:', err)
    });
  }

  openKontrahentWindow() {
    this.showKontrahentWindow = true;
  }

  closeKontrahentWindow() {
    this.showKontrahentWindow = false;
  }

  onKontrahentSelected(kontrahentInfo: TKontrahentInfo) {
    this.sprawa.kontrahent = {
      numer: kontrahentInfo.numer,
      identyfikator: kontrahentInfo.identyfikator,
      firma: kontrahentInfo.firma,
      nip: kontrahentInfo.nip,
      adres: kontrahentInfo.adres
    };
  }

  save() {
    if (this.selectedTypSprawyId) {
      const selectedTyp = this.sprawyTypy.find(t => t.typ === this.selectedTypSprawyId);
      if (selectedTyp) {
        this.sprawa.typ = {
          nazwa: selectedTyp.typ,
          rWA: selectedTyp.rWA
        };
      }
    }

    if (this.selectedRWAId) {
      this.sprawa.znak_RWA = this.selectedRWAId;
    }

    if (this.selectedNadzorJednostkaId) {
      const jedn = this.jednostki.find(j => j.symbol === this.selectedNadzorJednostkaId);
      if (jedn) {
        this.sprawa.nadzorWydzial = {
          symbol: jedn.symbol,
          nazwa: jedn.nazwa,
          kod: jedn.kod,
          stanowisko: jedn.stanowisko
        };
      }
    }

    if (this.selectedNadzorPracownikId) {
      const prac = this.nadzorPracownicy.find(p => p.numer === this.selectedNadzorPracownikId);
      if (prac) {
        this.sprawa.nadzorOsoba = prac;
      }
    }

    if (this.selectedWykJednostkaId) {
      const jedn = this.jednostki.find(j => j.symbol === this.selectedWykJednostkaId);
      if (jedn) {
        this.sprawa.wykWydzial = {
          symbol: jedn.symbol,
          nazwa: jedn.nazwa,
          kod: jedn.kod,
          stanowisko: jedn.stanowisko
        };
      }
    }

    if (this.selectedWykPracownikId) {
      const prac = this.wykPracownicy.find(p => p.numer === this.selectedWykPracownikId);
      if (prac) {
        this.sprawa.wykOsoba = prac;
      }
    }

    if (this.dataStartModel) {
      this.sprawa.dataStart = new Date(this.dataStartModel).toISOString();
    }
    if (this.dataStopModel) {
      this.sprawa.dataStop = new Date(this.dataStopModel).toISOString();
    }
    if (this.terminPlanModel) {
      this.sprawa.terminPlan = new Date(this.terminPlanModel).toISOString();
    }
    if (this.terminAlarmModel) {
      this.sprawa.terminAlarm = new Date(this.terminAlarmModel).toISOString();
    }

    this.sprawyService.createSprawa(this.sprawa).subscribe({
      next: (response) => {
        if (response.status === 'OK') {
          this.sprawa.znakSprawy = response.znakSprawy || '';
          this.sprawaCreated = true;
          this.sprawaSaved.emit();
        }
      },
      error: (err) => console.error('Error saving sprawa:', err)
    });
  }

  attachDocument() {
    console.log('Attach document - to be implemented');
  }

  detachDocument() {
    console.log('Detach document - to be implemented');
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.sprawaCreated = false;
    this.sprawa = this.getEmptySprawa();
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
      statusPrzek: '',
      odrzucona: false,
      kontrahent: {
        numer: 0,
        identyfikator: '',
        firma: false,
        nip: '',
        adres: ''
      },
      nadzorWydzial: {
        symbol: '',
        nazwa: '',
        kod: '',
        stanowisko: false
      },
      nadzorOsoba: { numer: 0, identyfikator: '' },
      wykWydzial: {
        symbol: '',
        nazwa: '',
        kod: '',
        stanowisko: false
      },
      wykOsoba: { numer: 0, identyfikator: '' },
      uprawPoziom: '',
      oper: TBazaOper.tboSelect,
      status: TeSodStatus.sBrak,
      statusDane: '',
      opis: ''
    };
  }
}
