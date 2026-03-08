import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Sprawa } from '../models/sprawa.model';
import { TSprawaTyp } from '../models/sprawa-typ.model';
import { TOsobaInfo } from '../models/osoba-info.model';
import { SprawaTypyService } from '../services/sprawa-typy.service';
import { JednostkiService } from '../services/jednostki.service';
import { PracownicyService } from '../services/pracownicy.service';
import { WykazAktService } from '../services/wykaz-akt.service';
import { SprawyService } from '../services/sprawy.service';
import { AuthService } from '../services/auth.service';
import { TJednostka } from '../models/typy-info.model';
import { WykazAkt } from '../models/wykaz-akt.model';
import { TBazaOper, TeSodStatus } from '../models/enums.model';

@Component({
  selector: 'app-sprawa-edit-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    Textarea
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '900px'}"
      [header]="sprawa.numer ? 'Edycja sprawy' : 'Nowa sprawa'"
      (onHide)="onClose()">

      <div class="form-container">
        <div class="field">
          <label for="typSprawy">Typ Sprawy</label>
          <select class="form-select" [(ngModel)]="selectedTypSprawyId" (change)="onTypSprawyChange()">
            <option [value]="null">Wybierz typ sprawy</option>
            <option *ngFor="let typ of sprawyTypy" [value]="typ.typ">{{ typ.typ }}</option>
          </select>
        </div>

        <div class="field">
          <label for="nazwa">Nazwa</label>
          <input
            pInputText
            id="nazwa"
            [(ngModel)]="sprawa.nazwa"
            type="text"
            class="form-input" />
        </div>

        <div class="field">
          <label for="kontrahent">Kontrahent</label>
          <div class="kontrahent-select">
            <input
              pInputText
              id="kontrahent"
              [(ngModel)]="kontrahentDisplay"
              type="text"
              readonly
              class="form-input" />
            <p-button
              icon="pi pi-search"
              (onClick)="selectKontrahent()"
              styleClass="p-button-sm">
            </p-button>
          </div>
        </div>

        <div class="field-group">
          <div class="field">
            <label for="znakSprawy">Znak sprawy</label>
            <input
              pInputText
              id="znakSprawy"
              [(ngModel)]="sprawa.znakSprawy"
              type="text"
              [readonly]="true"
              class="form-input" />
          </div>

          <div class="field">
            <label for="znakRWA">RWA</label>
            <select class="form-select" [(ngModel)]="selectedRWAId">
              <option [value]="null">Wybierz RWA</option>
              <option *ngFor="let rwa of wykazyAkt" [value]="rwa.symbol">{{ rwa.symbol }}</option>
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
            pTextarea
            id="opis"
            [(ngModel)]="sprawa.opis"
            rows="4"
            class="form-textarea">
          </textarea>
        </div>

        <div class="documents-panel" [class.disabled]="!sprawaCreated">
          <h3>Dokumenty sprawy</h3>
          <div class="documents-buttons">
            <p-button
              label="Dołącz dokument"
              icon="pi pi-plus"
              [disabled]="!sprawaCreated"
              (onClick)="attachDocument()">
            </p-button>
            <p-button
              label="Odłącz dokument"
              icon="pi pi-minus"
              [disabled]="!sprawaCreated"
              (onClick)="detachDocument()">
            </p-button>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button
            *ngIf="!sprawaCreated"
            label="Zapisz"
            icon="pi pi-check"
            (onClick)="save()">
          </p-button>
          <p-button
            *ngIf="!sprawaCreated"
            label="Anuluj"
            icon="pi pi-times"
            (onClick)="onClose()"
            styleClass="p-button-secondary">
          </p-button>
          <p-button
            *ngIf="sprawaCreated"
            label="Wyjście"
            icon="pi pi-times"
            (onClick)="onClose()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
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
    }

    .field-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-select {
      cursor: pointer;
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
    }

    .documents-panel.disabled {
      opacity: 0.5;
      background-color: #f8f9fa;
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

    .dialog-footer {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
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

  kontrahentDisplay: string = '';
  sprawaCreated: boolean = false;

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

  selectKontrahent() {
    console.log('Select kontrahent - to be implemented');
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
