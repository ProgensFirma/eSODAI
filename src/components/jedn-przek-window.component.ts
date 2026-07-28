import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JednPrzekService } from '../services/jedn-przek.service';
import { TJednPrzek } from '../models/jedn-przek.model';

@Component({
  selector: 'app-jedn-przek-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Jednostki przekazań</h2>
          <button class="close-button" (click)="close()">✕</button>
        </div>

        <div class="modal-body">
          <div class="loading" *ngIf="loading">Ładowanie...</div>
          <div class="table-container" *ngIf="!loading">
            <table class="jedn-przek-table">
              <thead>
                <tr>
                  <th class="col-symbol">Symbol</th>
                  <th class="col-nazwa">Nazwa</th>
                  <th class="col-edorecz">Adres eDoręczeń</th>
                  <th class="col-flag">Główna</th>
                  <th class="col-flag">Własna</th>
                  <th class="col-flag">SSOD</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let j of jednostki">
                  <td class="col-symbol">{{ j.symbol }}</td>
                  <td class="col-nazwa">{{ j.nazwa }}</td>
                  <td class="col-edorecz">{{ j.eDoreczAdres }}</td>
                  <td class="col-flag">
                    <span *ngIf="j.glowna" class="flag-yes">✓</span>
                    <span *ngIf="!j.glowna" class="flag-no">—</span>
                  </td>
                  <td class="col-flag">
                    <span *ngIf="j.wlasna" class="flag-yes">✓</span>
                    <span *ngIf="!j.wlasna" class="flag-no">—</span>
                  </td>
                  <td class="col-flag">
                    <span *ngIf="j.nSSOD" class="flag-yes">✓</span>
                    <span *ngIf="!j.nSSOD" class="flag-no">—</span>
                  </td>
                </tr>
                <tr *ngIf="jednostki.length === 0">
                  <td colspan="6" class="empty-row">Brak jednostek przekazań</td>
                </tr>
              </tbody>
            </table>
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
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-window {
      background: var(--bg-surface);
      border-radius: 16px;
      box-shadow: 0 20px 60px var(--shadow-md);
      width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      transition: var(--transition-theme);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 2px solid var(--border-default);
      background: linear-gradient(135deg, var(--bg-subtle), var(--border-default));
    }

    .modal-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .close-button {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--text-muted);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: var(--border-default);
      color: var(--text-primary);
    }

    .modal-body {
      flex: 1;
      overflow: auto;
      padding: 24px 32px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--text-muted);
      font-size: 14px;
    }

    .table-container {
      overflow-x: auto;
    }

    .jedn-przek-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--bg-surface);
      border-radius: 8px;
      overflow: hidden;
    }

    .jedn-przek-table thead {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
    }

    .jedn-przek-table th {
      padding: 12px 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
    }

    .jedn-przek-table th.col-flag {
      text-align: center;
      width: 80px;
    }

    .jedn-przek-table tbody tr {
      border-bottom: 1px solid var(--border-default);
      transition: background 0.2s ease;
    }

    .jedn-przek-table tbody tr:hover {
      background: var(--table-row-hover);
    }

    .jedn-przek-table tbody tr:last-child {
      border-bottom: none;
    }

    .jedn-przek-table td {
      padding: 10px 16px;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .jedn-przek-table td.col-symbol {
      font-weight: 600;
      color: var(--text-primary);
    }

    .jedn-przek-table td.col-nazwa {
      color: var(--text-primary);
    }

    .jedn-przek-table td.col-flag {
      text-align: center;
    }

    .flag-yes {
      color: #16a34a;
      font-weight: 700;
    }

    .flag-no {
      color: var(--text-muted);
    }

    .empty-row {
      text-align: center;
      color: var(--text-muted);
      padding: 24px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 32px;
      border-top: 1px solid var(--border-default);
      background: var(--bg-subtle);
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

    @media (max-width: 868px) {
      .modal-window {
        width: 95vw;
      }
    }

    @media (max-width: 768px) {
      .modal-window {
        width: 100%;
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

      .jedn-przek-table th,
      .jedn-przek-table td {
        padding: 8px 12px;
        font-size: 12px;
      }

      .jedn-przek-table th.col-flag {
        width: 60px;
      }
    }
  `]
})
export class JednPrzekWindowComponent implements OnInit {
  @Output() closeRequested = new EventEmitter<void>();

  jednostki: TJednPrzek[] = [];
  loading = false;

  constructor(private jednPrzekService: JednPrzekService) {}

  ngOnInit() {
    this.loadJednPrzek();
  }

  loadJednPrzek() {
    this.loading = true;
    this.jednPrzekService.getJednPrzek().subscribe({
      next: (jednostki) => {
        this.jednostki = jednostki;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jednPrzek:', error);
        this.loading = false;
      }
    });
  }

  close() {
    this.closeRequested.emit();
  }
}
