import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sprawa } from '../models/sprawa.model';

export interface ZakonczData {
  sprawa: number;
  data: string;
  pozytywnie: boolean;
}

@Component({
  selector: 'app-sprawa-zakoncz-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="visible">
      <div class="modal-overlay">
        <div class="modal-window" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Zakończ sprawę</h2>
            <button class="close-btn" (click)="onCancel()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="sprawa-info" *ngIf="sprawa">
              <span class="label">Sprawa:</span>
              <span class="value">{{ sprawa.znakSprawy }} — {{ sprawa.nazwa }}</span>
            </div>

            <div class="field">
              <label>Data zakończenia</label>
              <input
                type="date"
                [(ngModel)]="dataZakonczeniaModel"
                [min]="dataMin"
                (ngModelChange)="onDataChange()"
              />
              <span class="field-error" *ngIf="dataError">{{ dataError }}</span>
            </div>

            <div class="field">
              <label>Wynik sprawy</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" name="wynik" [(ngModel)]="pozytywnie" [value]="true" />
                  <span>Pozytywnie</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="wynik" [(ngModel)]="pozytywnie" [value]="false" />
                  <span>Negatywnie</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="onCancel()">Anuluj</button>
            <button class="btn btn-primary" (click)="onZakonczClick()" [disabled]="!isValid()">Zakończ</button>
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
      width: 440px;
      max-width: 95vw;
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
      display: flex;
      flex-direction: column;
      gap: 18px;
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
    input[type="date"] {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--input-border, #d1d5db);
      border-radius: 6px;
      font-size: 13px;
      background: var(--input-bg, #fff);
      color: var(--text-primary, #111);
      box-sizing: border-box;
    }
    .field-error {
      font-size: 12px;
      color: #dc2626;
    }
    .radio-group {
      display: flex;
      gap: 24px;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
    .radio-option input[type="radio"] { cursor: pointer; accent-color: #2563eb; }
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
export class SprawaZakonczWindowComponent implements OnChanges {
  @Input() visible = false;
  @Input() sprawa: Sprawa | null = null;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() zakonczConfirmed = new EventEmitter<ZakonczData>();

  dataZakonczeniaModel = '';
  dataMin = '';
  dataError = '';
  pozytywnie = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      const today = new Date();
      this.dataZakonczeniaModel = today.toISOString().split('T')[0];

      if (this.sprawa?.dataStart) {
        const start = new Date(this.sprawa.dataStart);
        if (!isNaN(start.getTime()) && start.getFullYear() > 1900) {
          this.dataMin = start.toISOString().split('T')[0];
        } else {
          this.dataMin = '';
        }
      } else {
        this.dataMin = '';
      }

      this.pozytywnie = true;
      this.dataError = '';
    }
  }

  onDataChange() {
    if (this.dataMin && this.dataZakonczeniaModel < this.dataMin) {
      this.dataError = 'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia sprawy.';
    } else {
      this.dataError = '';
    }
  }

  isValid(): boolean {
    return !!this.dataZakonczeniaModel && !this.dataError;
  }

  onZakonczClick() {
    if (!this.isValid() || !this.sprawa) return;
    this.zakonczConfirmed.emit({
      sprawa: this.sprawa.numer,
      data: this.dataZakonczeniaModel,
      pozytywnie: this.pozytywnie
    });
  }

  onCancel() {
    this.closeRequested.emit();
  }
}
