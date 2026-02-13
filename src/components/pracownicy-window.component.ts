import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PracownicyService } from '../services/pracownicy.service';
import { TOsobaInfo } from '../models/typy-info.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pracownicy-window',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '80vw', height: '80vh'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onClose()"
      styleClass="custom-dialog"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-semibold">Pracownicy</span>
      </ng-template>

      <div class="pracownicy-container">
        <div class="toolbar">
          <span class="p-input-icon-left search-field">
            <i class="pi pi-search"></i>
            <input
              type="text"
              pInputText
              placeholder="Szukaj..."
              [(ngModel)]="searchText"
              (input)="onSearch()"
              class="w-full"
            />
          </span>
        </div>

        <p-table
          [value]="filteredPracownicy"
          [paginator]="true"
          [rows]="10"
          [(selection)]="selectedPracownik"
          selectionMode="single"
          dataKey="numer"
          [tableStyle]="{ 'min-width': '50rem' }"
          styleClass="p-datatable-sm"
          [loading]="loading"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 5rem">Numer</th>
              <th>Identyfikator</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-pracownik>
            <tr [pSelectableRow]="pracownik">
              <td>{{ pracownik.numer }}</td>
              <td>{{ pracownik.identyfikator }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="2" class="text-center">Brak pracowników do wyświetlenia</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <ng-template pTemplate="footer">
        <button
          pButton
          label="Zamknij"
          icon="pi pi-times"
          class="p-button-text"
          (click)="onClose()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .pracownicy-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: calc(80vh - 180px);
    }

    .toolbar {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .search-field {
      flex: 1;
    }

    ::ng-deep .custom-dialog .p-dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem;
    }

    ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      padding: 0.75rem;
      background-color: #f3f4f6;
      font-weight: 600;
    }
  `]
})
export class PracownicyWindowComponent implements OnInit {
  @Input() visible = true;
  @Output() visibleChange = new EventEmitter<boolean>();

  pracownicy: TOsobaInfo[] = [];
  filteredPracownicy: TOsobaInfo[] = [];
  selectedPracownik: TOsobaInfo | null = null;
  loading = false;
  searchText = '';

  constructor(
    private pracownicyService: PracownicyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPracownicy();
  }

  loadPracownicy() {
    this.loading = true;
    const session = this.authService.getCurrentSession();
    const jednostka = session?.jednostkaAkt?.symbol || '';

    this.pracownicyService.getPracownicy(jednostka).subscribe({
      next: (data) => {
        this.pracownicy = data;
        this.filteredPracownicy = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pracownicy:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    const search = this.searchText.toLowerCase();
    this.filteredPracownicy = this.pracownicy.filter(p =>
      p.identyfikator.toLowerCase().includes(search) ||
      p.numer.toString().includes(search)
    );
  }

  onClose() {
    this.visibleChange.emit(false);
  }
}
