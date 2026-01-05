import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UprawnienieService } from '../services/uprawnienia.service';
import { Uprawnienie } from '../models/uprawnienie.model';
import { TUprawPoziom } from '../models/enums.model';

@Component({
  selector: 'app-uprawnienia-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Uprawnienia użytkownika</h2>
          <button class="close-button" (click)="close()">✕</button>
        </div>

        <div class="modal-body">
          <div class="table-container">
            <table class="uprawnienia-table">
              <thead>
                <tr>
                  <th class="col-uprawnienie">Uprawnienie</th>
                  <th class="col-poziom">Brak</th>
                  <th class="col-poziom">Odczyt</th>
                  <th class="col-poziom">Zmiana</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let uprawnienie of uprawnienia">
                  <td class="col-uprawnienie">{{ uprawnienie.opis }}</td>
                  <td class="col-poziom">
                    <input
                      type="checkbox"
                      [checked]="uprawnienie.poziom === 'tup_brak'"
                      class="poziom-checkbox"
                      disabled
                    />
                  </td>
                  <td class="col-poziom">
                    <input
                      type="checkbox"
                      [checked]="uprawnienie.poziom === 'tup_odczyt'"
                      class="poziom-checkbox"
                      disabled
                    />
                  </td>
                  <td class="col-poziom">
                    <input
                      type="checkbox"
                      [checked]="uprawnienie.poziom === 'tup_zmiana'"
                      class="poziom-checkbox"
                      disabled
                    />
                  </td>
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
      width: 800px;
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
      overflow: auto;
      padding: 24px 32px;
    }

    .table-container {
      overflow-x: auto;
    }

    .uprawnienia-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .uprawnienia-table thead {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
    }

    .uprawnienia-table th {
      padding: 12px 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
    }

    .uprawnienia-table th.col-poziom {
      text-align: center;
      width: 100px;
    }

    .uprawnienia-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background 0.2s ease;
    }

    .uprawnienia-table tbody tr:hover {
      background: #f8fafc;
    }

    .uprawnienia-table tbody tr:last-child {
      border-bottom: none;
    }

    .uprawnienia-table td {
      padding: 10px 16px;
      font-size: 13px;
      color: #475569;
    }

    .uprawnienia-table td.col-uprawnienie {
      font-weight: 500;
      color: #1e293b;
    }

    .uprawnienia-table td.col-poziom {
      text-align: center;
    }

    .poziom-checkbox {
      width: 18px;
      height: 18px;
      cursor: default;
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

      .uprawnienia-table th,
      .uprawnienia-table td {
        padding: 8px 12px;
        font-size: 12px;
      }

      .uprawnienia-table th.col-poziom {
        width: 70px;
      }

      .poziom-checkbox {
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class UprawnienieWindowComponent implements OnInit {
  @Output() closeRequested = new EventEmitter<void>();

  uprawnienia: Uprawnienie[] = [];
  loading = false;

  constructor(private uprawnienieService: UprawnienieService) {}

  ngOnInit() {
    this.loadUprawnienia();
  }

  loadUprawnienia() {
    this.loading = true;
    this.uprawnienieService.getUprawnienia().subscribe({
      next: (uprawnienia) => {
        this.uprawnienia = uprawnienia;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading uprawnienia:', error);
        this.loading = false;
      }
    });
  }

  close() {
    this.closeRequested.emit();
  }
}
