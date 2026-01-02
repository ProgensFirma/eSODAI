import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametryService } from '../services/parametry.service';
import { Parametr, ParametrGrupa } from '../models/parametr.model';
import { TSODParamTyp } from '../models/enums.model';

@Component({
  selector: 'app-parametry-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Parametry systemu</h2>
          <button class="close-button" (click)="close()">✕</button>
        </div>

        <div class="modal-body">
          <div class="parametry-container">
            <div class="grupy-list">
              <div *ngFor="let grupa of grupy" class="grupa-section">
                <div
                  class="grupa-header"
                  [class.expanded]="grupa.expanded"
                  (click)="toggleGrupa(grupa)"
                >
                  <span class="expand-icon">{{ grupa.expanded ? '▼' : '▶' }}</span>
                  <span class="grupa-nazwa">{{ grupa.nazwa }}</span>
                  <span class="grupa-count">({{ grupa.parametry.length }})</span>
                </div>

                <div class="parametry-list" *ngIf="grupa.expanded">
                  <div
                    *ngFor="let param of grupa.parametry"
                    class="parametr-item"
                    [class.selected]="selectedParametr === param"
                    (click)="selectParametr(param)"
                  >
                    <div class="parametr-row">
                      <label class="parametr-label">{{ param.opis }}</label>
                      <div class="parametr-value">
                        <input
                          *ngIf="param.typ === 'ptString'"
                          type="text"
                          [value]="param.wartosc"
                          class="value-input"
                          readonly
                        />
                        <input
                          *ngIf="param.typ === 'ptInteger'"
                          type="number"
                          [value]="param.wartosc"
                          class="value-input"
                          readonly
                        />
                        <input
                          *ngIf="param.typ === 'ptNumeric'"
                          type="number"
                          step="0.01"
                          [value]="param.wartosc"
                          class="value-input"
                          readonly
                        />
                        <label
                          *ngIf="param.typ === 'ptBoolean'"
                          class="checkbox-label"
                        >
                          <input
                            type="checkbox"
                            [checked]="param.wartosc === 'True' || param.wartosc === 'true'"
                            class="value-checkbox"
                            disabled
                          />
                          <span class="checkbox-text">{{ param.wartosc === 'True' || param.wartosc === 'true' ? 'Tak' : 'Nie' }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pomoc-section">
              <div class="pomoc-header">
                <span class="pomoc-icon">ℹ️</span>
                <span class="pomoc-title">Pomoc</span>
              </div>
              <div class="pomoc-content">
                <p *ngIf="selectedParametr">{{ selectedParametr.pomoc }}</p>
                <p *ngIf="!selectedParametr" class="no-selection">Wybierz parametr, aby zobaczyć szczegółową pomoc</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="button button-secondary" (click)="close()">Zamknij</button>
        </div>
      </div>
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
      z-index: 1000;
      padding: 20px;
    }

    .modal-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 2px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    }

    .modal-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #64748b;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .modal-body {
      flex: 1;
      overflow: hidden;
      padding: 24px 32px;
    }

    .parametry-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100%;
    }

    .grupy-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
    }

    .grupy-list::-webkit-scrollbar {
      width: 8px;
    }

    .grupy-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .grupy-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .grupy-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .grupa-section {
      border-bottom: 1px solid #e2e8f0;
    }

    .grupa-section:last-child {
      border-bottom: none;
    }

    .grupa-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;
      color: #1e293b;
      user-select: none;
    }

    .grupa-header:hover {
      background: #f1f5f9;
    }

    .grupa-header.expanded {
      background: #e0f2fe;
      border-bottom: 2px solid #0ea5e9;
    }

    .expand-icon {
      font-size: 12px;
      color: #64748b;
      transition: transform 0.2s ease;
    }

    .grupa-nazwa {
      flex: 1;
      font-size: 16px;
    }

    .grupa-count {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    .parametry-list {
      background: #fefefe;
    }

    .parametr-item {
      padding: 16px 20px 16px 52px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .parametr-item:hover {
      background: #f8fafc;
    }

    .parametr-item.selected {
      background: #e0f2fe;
      border-left: 4px solid #0ea5e9;
    }

    .parametr-item:last-child {
      border-bottom: none;
    }

    .parametr-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .parametr-label {
      flex: 0 0 250px;
      font-size: 14px;
      font-weight: 500;
      color: #475569;
    }

    .parametr-value {
      flex: 1;
    }

    .value-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      color: #1e293b;
    }

    .value-input:focus {
      outline: none;
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: default;
    }

    .value-checkbox {
      width: 18px;
      height: 18px;
      cursor: default;
    }

    .checkbox-text {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }

    .pomoc-section {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      overflow: hidden;
    }

    .pomoc-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .pomoc-icon {
      font-size: 18px;
    }

    .pomoc-title {
      font-size: 15px;
    }

    .pomoc-content {
      padding: 16px;
      min-height: 80px;
      max-height: 120px;
      overflow-y: auto;
    }

    .pomoc-content p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
    }

    .pomoc-content .no-selection {
      color: #94a3b8;
      font-style: italic;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 32px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .button {
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .button-secondary {
      background: #64748b;
      color: white;
    }

    .button-secondary:hover {
      background: #475569;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
    }

    @media (max-width: 768px) {
      .modal-window {
        max-width: 100%;
        max-height: 100vh;
        border-radius: 0;
      }

      .modal-header {
        padding: 20px 24px;
      }

      .modal-title {
        font-size: 20px;
      }

      .modal-body {
        padding: 20px 24px;
      }

      .parametr-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .parametr-label {
        flex: unset;
      }

      .parametr-value {
        width: 100%;
      }
    }
  `]
})
export class ParametryWindowComponent implements OnInit {
  @Output() closeRequested = new EventEmitter<void>();

  grupy: ParametrGrupa[] = [];
  selectedParametr: Parametr | null = null;
  loading = false;

  constructor(private parametryService: ParametryService) {}

  ngOnInit() {
    this.loadParametry();
  }

  loadParametry() {
    this.loading = true;
    this.parametryService.getParametry().subscribe({
      next: (parametry) => {
        this.grupy = this.groupParametry(parametry);
        if (this.grupy.length > 0) {
          this.grupy[0].expanded = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading parametry:', error);
        this.loading = false;
      }
    });
  }

  private groupParametry(parametry: Parametr[]): ParametrGrupa[] {
    const grupaMap = new Map<string, Parametr[]>();

    parametry.forEach(param => {
      if (!grupaMap.has(param.grupa)) {
        grupaMap.set(param.grupa, []);
      }
      grupaMap.get(param.grupa)!.push(param);
    });

    const grupy: ParametrGrupa[] = [];
    grupaMap.forEach((params, nazwa) => {
      params.sort((a, b) => a.kolejnosc - b.kolejnosc);
      grupy.push({
        nazwa,
        parametry: params,
        expanded: false
      });
    });

    grupy.sort((a, b) => a.nazwa.localeCompare(b.nazwa));
    return grupy;
  }

  toggleGrupa(grupa: ParametrGrupa) {
    grupa.expanded = !grupa.expanded;
  }

  selectParametr(param: Parametr) {
    this.selectedParametr = param;
  }

  close() {
    this.closeRequested.emit();
  }
}
