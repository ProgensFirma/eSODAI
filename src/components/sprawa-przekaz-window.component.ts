import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JednostkiService } from '../services/jednostki.service';
import { PracownicyService } from '../services/pracownicy.service';
import { AuthService } from '../services/auth.service';
import { TJednostka, TOsobaInfo } from '../models/typy-info.model';
import { Sprawa } from '../models/sprawa.model';

export interface PrzekazData {
  doJednostki: string;
  doOsoby: number;
  doJednostkiNadzor: string;
  doOsobyNadzor: number;
  notatka: string;
}

@Component({
  selector: 'app-sprawa-przekaz-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="visible">
      <div class="modal-overlay">
        <div class="modal-window" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Przekaż sprawę</h2>
            <button class="close-btn" (click)="onCancel()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="sprawa-info" *ngIf="sprawa">
              <span class="label">Sprawa:</span>
              <span class="value">{{ sprawa.znakSprawy }} — {{ sprawa.nazwa }}</span>
            </div>

            <div class="section-title">Wykonujący</div>

            <div class="field">
              <label>Jednostka wykonująca</label>
              <select [(ngModel)]="doJednostki" (ngModelChange)="onWykJednostkaChange()">
                <option value="">— wybierz —</option>
                <option *ngFor="let j of jednostki" [value]="j.symbol">{{ j.symbol }} — {{ j.nazwa }}</option>
              </select>
            </div>

            <div class="field">
              <label>Osoba wykonująca</label>
              <select [(ngModel)]="doOsoby" [disabled]="!doJednostki">
                <option [value]="0">— wybierz —</option>
                <option *ngFor="let p of wykPracownicy" [value]="p.numer">{{ p.identyfikator }}</option>
              </select>
            </div>

            <div class="section-title">Nadzorujący</div>

            <div class="field">
              <label>Jednostka nadzorująca</label>
              <select [(ngModel)]="doJednostkiNadzor" (ngModelChange)="onNadzorJednostkaChange()">
                <option value="">— wybierz —</option>
                <option *ngFor="let j of jednostki" [value]="j.symbol">{{ j.symbol }} — {{ j.nazwa }}</option>
              </select>
            </div>

            <div class="field">
              <label>Osoba nadzorująca</label>
              <select [(ngModel)]="doOsobyNadzor" [disabled]="!doJednostkiNadzor">
                <option [value]="0">— wybierz —</option>
                <option *ngFor="let p of nadzorPracownicy" [value]="p.numer">{{ p.identyfikator }}</option>
              </select>
            </div>

            <div class="field">
              <label>Notatka</label>
              <textarea [(ngModel)]="notatka" rows="3" placeholder="Opcjonalna notatka..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="onCancel()">Anuluj</button>
            <button class="btn btn-primary" (click)="onPrzekazClick()" [disabled]="!isValid()">Przekaż</button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .modal-window {
      background: var(--bg-surface, #fff);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      width: 520px;
      max-width: 95vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-default, #e5e7eb);
    }
    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary, #111);
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: var(--text-muted, #6b7280);
      line-height: 1;
      padding: 0 4px;
    }
    .close-btn:hover { color: var(--text-primary, #111); }
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .sprawa-info {
      background: var(--bg-subtle, #f9fafb);
      border: 1px solid var(--border-muted, #e5e7eb);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      display: flex;
      gap: 8px;
    }
    .sprawa-info .label { font-weight: 600; color: var(--text-secondary, #374151); }
    .sprawa-info .value { color: var(--text-primary, #111); }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted, #6b7280);
      padding-bottom: 4px;
      border-bottom: 1px solid var(--border-muted, #e5e7eb);
      margin-top: 4px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary, #374151);
    }
    select, textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--input-border, #d1d5db);
      border-radius: 6px;
      font-size: 13px;
      background: var(--input-bg, #fff);
      color: var(--text-primary, #111);
      box-sizing: border-box;
    }
    select:disabled { opacity: 0.6; }
    textarea { resize: vertical; font-family: inherit; }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--border-default, #e5e7eb);
    }
    .btn {
      padding: 9px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-secondary {
      background: var(--input-bg, #fff);
      border-color: var(--input-border, #d1d5db);
      color: var(--text-secondary, #374151);
    }
    .btn-secondary:hover { background: var(--bg-muted, #f3f4f6); }
    .btn-primary {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }
    .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class SprawaPrzekazWindowComponent implements OnChanges {
  @Input() visible = false;
  @Input() sprawa: Sprawa | null = null;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() przekazConfirmed = new EventEmitter<PrzekazData>();

  jednostki: TJednostka[] = [];
  wykPracownicy: TOsobaInfo[] = [];
  nadzorPracownicy: TOsobaInfo[] = [];

  doJednostki = '';
  doOsoby = 0;
  doJednostkiNadzor = '';
  doOsobyNadzor = 0;
  notatka = '';

  constructor(
    private jednostkiService: JednostkiService,
    private pracownicyService: PracownicyService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.loadJednostki();
    }
  }

  private loadJednostki() {
    this.jednostkiService.getJednostki().subscribe({
      next: (jednostki) => {
        this.jednostki = jednostki;
        this.setDefaults();
      },
      error: (err) => console.error('Error loading jednostki:', err)
    });
  }

  private setDefaults() {
    const session = this.authService.getCurrentSession();
    if (!session) return;

    const symbol = session.jednostkaAkt.symbol;
    this.doJednostki = symbol;
    this.doJednostkiNadzor = symbol;

    this.pracownicyService.getPracownicy(symbol).subscribe({
      next: (pracownicy) => {
        this.wykPracownicy = pracownicy;
        this.nadzorPracownicy = pracownicy;
        const osoba = pracownicy.find(p => p.numer === session.osoba);
        if (osoba) {
          this.doOsoby = osoba.numer;
          this.doOsobyNadzor = osoba.numer;
        }
      },
      error: (err) => console.error('Error loading pracownicy:', err)
    });
  }

  onWykJednostkaChange() {
    this.doOsoby = 0;
    if (this.doJednostki) {
      this.pracownicyService.getPracownicy(this.doJednostki).subscribe({
        next: (p) => { this.wykPracownicy = p; },
        error: (err) => console.error(err)
      });
    }
  }

  onNadzorJednostkaChange() {
    this.doOsobyNadzor = 0;
    if (this.doJednostkiNadzor) {
      this.pracownicyService.getPracownicy(this.doJednostkiNadzor).subscribe({
        next: (p) => { this.nadzorPracownicy = p; },
        error: (err) => console.error(err)
      });
    }
  }

  isValid(): boolean {
    return !!this.doJednostki && this.doOsoby > 0 && !!this.doJednostkiNadzor && this.doOsobyNadzor > 0;
  }

  onPrzekazClick() {
    if (!this.isValid()) return;
    this.przekazConfirmed.emit({
      doJednostki: this.doJednostki,
      doOsoby: this.doOsoby,
      doJednostkiNadzor: this.doJednostkiNadzor,
      doOsobyNadzor: this.doOsobyNadzor,
      notatka: this.notatka
    });
  }

  onCancel() {
    this.notatka = '';
    this.closeRequested.emit();
  }
}
