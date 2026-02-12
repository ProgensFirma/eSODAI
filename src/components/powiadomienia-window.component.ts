import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { PowiadomieniaService } from '../services/powiadomienia.service';
import { TPowiadomienie } from '../models/powiadomienie.model';

@Component({
  selector: 'app-powiadomienia-window',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, PanelModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '90vw', height: '90vh'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onClose()"
      styleClass="custom-dialog"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-semibold">Powiadomienia</span>
      </ng-template>

      <div class="powiadomienia-container">
        <div class="toolbar">
          <button
            pButton
            label="Nowy"
            icon="pi pi-plus"
            class="p-button-success"
            (click)="onNowy()"
          ></button>
          <button
            pButton
            label="Popraw"
            icon="pi pi-pencil"
            class="p-button-warning"
            [disabled]="!selectedPowiadomienie || selectedPowiadomienie.pobrano"
            (click)="onPopraw()"
          ></button>
          <button
            pButton
            label="Usuń"
            icon="pi pi-trash"
            class="p-button-danger"
            [disabled]="!selectedPowiadomienie || selectedPowiadomienie.pobrano"
            (click)="onUsun()"
          ></button>
        </div>

        <p-table
          [value]="powiadomienia"
          [paginator]="true"
          [rows]="5"
          [totalRecords]="totalRecords"
          [loading]="loading"
          [(selection)]="selectedPowiadomienie"
          selectionMode="single"
          dataKey="numer"
          [tableStyle]="{ 'min-width': '50rem' }"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 4rem">Pobrano</th>
              <th style="width: 5rem">Potwierdzono</th>
              <th>Autor</th>
              <th>Kontrahent</th>
              <th style="width: 10rem">Data</th>
              <th style="width: 10rem">Data ważności</th>
              <th>Nagłówek</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-powiadomienie>
            <tr [pSelectableRow]="powiadomienie">
              <td class="text-center">
                <i
                  [class]="powiadomienie.pobrano ? 'pi pi-check-circle' : 'pi pi-circle'"
                  [style.color]="powiadomienie.pobrano ? 'green' : 'gray'"
                  style="font-size: 1.2rem"
                ></i>
              </td>
              <td class="text-center">
                <i
                  [class]="powiadomienie.potwierdzono ? 'pi pi-check-circle' : 'pi pi-circle'"
                  [style.color]="powiadomienie.potwierdzono ? 'green' : 'gray'"
                  style="font-size: 1.2rem"
                ></i>
              </td>
              <td>{{ powiadomienie.autor.identyfikator }}</td>
              <td>{{ powiadomienie.kontrahent.identyfikator }}</td>
              <td>{{ formatDate(powiadomienie.data) }}</td>
              <td>{{ formatDate(powiadomienie.dataWazn) }}</td>
              <td>{{ powiadomienie.naglowek }}</td>
            </tr>
          </ng-template>
        </p-table>

        <p-panel
          *ngIf="selectedPowiadomienie"
          header="Szczegóły powiadomienia"
          [toggleable]="false"
          styleClass="szczegoly-panel"
        >
          <div class="szczegoly-grid">
            <div class="szczegol-row">
              <strong>Status:</strong>
              <div>
                <div class="status-item">
                  <i
                    [class]="selectedPowiadomienie.pobrano ? 'pi pi-check-circle' : 'pi pi-circle'"
                    [style.color]="selectedPowiadomienie.pobrano ? 'green' : 'gray'"
                  ></i>
                  <span>Pobrano: {{ selectedPowiadomienie.pobrano ? formatDate(selectedPowiadomienie.pobranoData) : 'Nie' }}</span>
                </div>
                <div class="status-item">
                  <i
                    [class]="selectedPowiadomienie.potwierdzono ? 'pi pi-check-circle' : 'pi pi-circle'"
                    [style.color]="selectedPowiadomienie.potwierdzono ? 'green' : 'gray'"
                  ></i>
                  <span>Potwierdzono: {{ selectedPowiadomienie.potwierdzono ? formatDate(selectedPowiadomienie.potwierdzonoData) : 'Nie' }}</span>
                </div>
              </div>
            </div>

            <div class="szczegol-row">
              <strong>Autor:</strong>
              <span>{{ selectedPowiadomienie.autor.identyfikator }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Kontrahent:</strong>
              <span>{{ selectedPowiadomienie.kontrahent.identyfikator }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Email:</strong>
              <span>{{ selectedPowiadomienie.email }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Telefon:</strong>
              <span>{{ selectedPowiadomienie.telefon || 'Brak' }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Data:</strong>
              <span>{{ formatDate(selectedPowiadomienie.data) }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Data ważności:</strong>
              <span>{{ formatDate(selectedPowiadomienie.dataWazn) }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Nagłówek:</strong>
              <span>{{ selectedPowiadomienie.naglowek }}</span>
            </div>

            <div class="szczegol-row">
              <strong>Opis:</strong>
              <span class="opis-text">{{ selectedPowiadomienie.opis }}</span>
            </div>

            <div class="szczegol-row" *ngIf="selectedPowiadomienie.sprawa">
              <strong>Sprawa:</strong>
              <div>
                <div>Znak: {{ selectedPowiadomienie.sprawa.znakSprawy }}</div>
                <div>Nazwa: {{ selectedPowiadomienie.sprawa.nazwa }}</div>
              </div>
            </div>

            <div class="szczegol-row" *ngIf="selectedPowiadomienie.dokument">
              <strong>Dokument:</strong>
              <div>
                <div>Nazwa: {{ selectedPowiadomienie.dokument.nazwa }}</div>
                <div>Nr pozycji: {{ selectedPowiadomienie.dokument.rejestrNrPozycji }}</div>
              </div>
            </div>
          </div>
        </p-panel>
      </div>
    </p-dialog>
  `,
  styles: [`
    .powiadomienia-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: calc(90vh - 120px);
    }

    .toolbar {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .szczegoly-panel {
      margin-top: 1rem;
    }

    .szczegoly-grid {
      display: grid;
      gap: 0.75rem;
    }

    .szczegol-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .szczegol-row:last-child {
      border-bottom: none;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .opis-text {
      white-space: pre-wrap;
      line-height: 1.5;
    }

    ::ng-deep .custom-dialog .p-dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.5rem;
    }

    ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      padding: 0.75rem 0.5rem;
      background-color: #f3f4f6;
      font-weight: 600;
    }
  `]
})
export class PowiadomieniaWindowComponent implements OnInit {
  @Input() visible = true;
  @Input() sesja = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  powiadomienia: TPowiadomienie[] = [];
  selectedPowiadomienie: TPowiadomienie | null = null;
  loading = false;
  totalRecords = 0;
  useMockData = true;

  constructor(private powiadomieniaService: PowiadomieniaService) {}

  ngOnInit() {
    this.initializeMockData();
  }

  initializeMockData() {
    const mockData = this.powiadomieniaService.getMockPowiadomienia();
    this.powiadomienia = mockData;
    this.totalRecords = mockData.length;
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '1899-12-30T00:00:00.000Z') {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onNowy() {
    console.log('Nowe powiadomienie');
  }

  onPopraw() {
    console.log('Popraw powiadomienie:', this.selectedPowiadomienie);
  }

  onUsun() {
    console.log('Usuń powiadomienie:', this.selectedPowiadomienie);
  }

  onClose() {
    this.visibleChange.emit(false);
  }
}
