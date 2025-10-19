import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TWydzialInfo } from '../models/typy-info.model';

@Component({
  selector: 'app-wydzial-select-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wydzial-overlay">
      <div class="wydzial-window">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">🏢</span>
            Wybór jednostki organizacyjnej
          </h2>
        </div>

        <div class="window-content">
          <p class="instruction">Wybierz jednostkę organizacyjną, w której chcesz pracować:</p>

          <div class="wydzialy-list">
            <div
              *ngFor="let wydzial of wydzialy"
              class="wydzial-item"
              [class.selected]="selectedWydzial?.symbol === wydzial.symbol"
              (click)="selectWydzial(wydzial)"
            >
              <div class="wydzial-symbol">{{ wydzial.symbol }}</div>
              <div class="wydzial-nazwa">{{ wydzial.nazwa }}</div>
            </div>
          </div>

          <div class="window-footer">
            <button
              class="select-button"
              [disabled]="!selectedWydzial"
              (click)="confirmSelection()"
            >
              Wybierz
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wydzial-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .wydzial-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .window-header {
      padding: 24px 32px;
      border-bottom: 2px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc, #ffffff);
    }

    .window-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      font-size: 28px;
    }

    .window-content {
      flex: 1;
      padding: 24px 32px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .instruction {
      margin: 0;
      font-size: 16px;
      color: #475569;
      line-height: 1.5;
    }

    .wydzialy-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    .wydzial-item {
      padding: 16px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }

    .wydzial-item:hover {
      border-color: #3b82f6;
      background: #f0f9ff;
      transform: translateX(4px);
    }

    .wydzial-item.selected {
      border-color: #3b82f6;
      background: #dbeafe;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .wydzial-symbol {
      font-size: 14px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 4px;
    }

    .wydzial-nazwa {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .window-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .select-button {
      padding: 12px 32px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .select-button:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }

    .select-button:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
  `]
})
export class WydzialSelectWindowComponent implements OnInit {
  @Input() wydzialy: TWydzialInfo[] = [];
  @Output() wydzialSelected = new EventEmitter<TWydzialInfo>();

  selectedWydzial: TWydzialInfo | null = null;

  ngOnInit() {
    if (this.wydzialy && this.wydzialy.length > 0) {
      this.selectedWydzial = this.wydzialy[0];
    }
  }

  selectWydzial(wydzial: TWydzialInfo) {
    this.selectedWydzial = wydzial;
  }

  confirmSelection() {
    if (this.selectedWydzial) {
      this.wydzialSelected.emit(this.selectedWydzial);
    }
  }
}
