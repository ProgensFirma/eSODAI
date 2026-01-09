import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WykazAktService } from '../services/wykaz-akt.service';
import { WykazAkt } from '../models/wykaz-akt.model';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-wykaz-akt-window',
  standalone: true,
  imports: [CommonModule, Tree],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Wykaz akt</h2>
          <button class="close-button" (click)="close()">✕</button>
        </div>

        <div class="modal-body">
          <div class="content-layout">
            <div class="tree-panel">
              <p-tree
                [value]="treeNodes"
                selectionMode="single"
                [(selection)]="selectedNode"
                (onNodeSelect)="onNodeSelect($event)"
                [loading]="loading"
                styleClass="custom-tree"
              ></p-tree>
            </div>

            <div class="details-panel" *ngIf="selectedWykazAkt">
              <div class="details-content">
                <div class="detail-section">
                  <h3 class="section-title">Poziom archiwum</h3>
                  <div class="detail-grid">
                    <div class="detail-item" *ngIf="selectedWykazAkt.archM">
                      <label>Jednostka macierzysta:</label>
                      <span class="detail-value">{{ selectedWykazAkt.archM }}</span>
                    </div>
                    <div class="detail-item" *ngIf="selectedWykazAkt.archI">
                      <label>Jednostka inna:</label>
                      <span class="detail-value">{{ selectedWykazAkt.archI }}</span>
                    </div>
                    <div class="no-data" *ngIf="!selectedWykazAkt.archM && !selectedWykazAkt.archI">
                      Brak danych o poziomie archiwum
                    </div>
                  </div>
                </div>

                <div class="detail-section" *ngIf="selectedWykazAkt.uwagi">
                  <h3 class="section-title">Uwagi</h3>
                  <div class="uwagi-content">
                    {{ selectedWykazAkt.uwagi }}
                  </div>
                </div>

                <div class="detail-section" *ngIf="!selectedWykazAkt.uwagi">
                  <h3 class="section-title">Uwagi</h3>
                  <div class="no-data">
                    Brak uwag
                  </div>
                </div>
              </div>
            </div>

            <div class="details-panel empty" *ngIf="!selectedWykazAkt">
              <div class="empty-state">
                <div class="empty-icon">📁</div>
                <p>Wybierz element z drzewa aby zobaczyć szczegóły</p>
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
      width: 1000px;
      max-width: 95vw;
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
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 20px;
      height: 600px;
      overflow: hidden;
    }

    .tree-panel {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 600px;
      padding: 12px;
    }

    ::ng-deep .custom-tree {
      border: none;
      height: 100%;
      overflow-y: auto;
    }

    ::ng-deep .custom-tree .p-tree-container {
      height: 100%;
    }

    ::ng-deep .custom-tree .p-treenode {
      padding: 4px 0;
    }

    ::ng-deep .custom-tree .p-treenode-content {
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    ::ng-deep .custom-tree .p-treenode-content:hover {
      background: #f1f5f9;
    }

    ::ng-deep .custom-tree .p-treenode-content.p-highlight {
      background: #dbeafe;
      color: #1e40af;
    }

    ::ng-deep .custom-tree .p-tree-toggler {
      width: 2rem;
      height: 2rem;
      color: #64748b;
    }

    ::ng-deep .custom-tree .p-tree-toggler:hover {
      color: #1e293b;
    }

    ::ng-deep .custom-tree .p-treenode-children {
      padding-left: 2.5rem;
    }

    .details-panel {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      overflow-y: auto;
      padding: 20px;
      height: 600px;
    }

    .details-panel.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 600px;
    }

    .empty-state {
      text-align: center;
      color: #94a3b8;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .details-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .detail-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }

    .section-title {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .detail-value {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      background: white;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .uwagi-content {
      font-size: 13px;
      line-height: 1.6;
      color: #475569;
      background: white;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .no-data {
      font-size: 13px;
      color: #94a3b8;
      font-style: italic;
      padding: 8px 12px;
      text-align: center;
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
        width: 100%;
        max-height: 100vh;
        border-radius: 0;
      }

      .content-layout {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
      }

      .modal-header {
        padding: 20px 24px;
      }

      .modal-title {
        font-size: 20px;
      }
    }
  `]
})
export class WykazAktWindowComponent implements OnInit {
  @Output() closeRequested = new EventEmitter<void>();

  wykazAktList: WykazAkt[] = [];
  treeNodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  selectedWykazAkt: WykazAkt | null = null;
  loading = false;

  constructor(private wykazAktService: WykazAktService) {}

  ngOnInit() {
    this.loadWykazAkt();
  }

  loadWykazAkt() {
    this.loading = true;
    this.wykazAktService.getWykazAkt().subscribe({
      next: (wykazAktList) => {
        this.wykazAktList = wykazAktList;
        this.treeNodes = this.buildTree(wykazAktList);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wykaz akt:', error);
        this.loading = false;
      }
    });
  }

  buildTree(wykazAktList: WykazAkt[]): TreeNode[] {
    const nodeMap = new Map<string, TreeNode>();

    wykazAktList.forEach(wykazAkt => {
      nodeMap.set(wykazAkt.symbol, {
        label: `${wykazAkt.symbol} - ${wykazAkt.nazwa}`,
        data: wykazAkt,
        children: [],
        expanded: wykazAkt.poziom === 1,
        key: wykazAkt.symbol
      });
    });

    const rootNodes: TreeNode[] = [];

    wykazAktList.forEach(wykazAkt => {
      const node = nodeMap.get(wykazAkt.symbol)!;

      if (wykazAkt.poziom === 1) {
        rootNodes.push(node);
      } else {
        const parentSymbol = wykazAkt.symbol.slice(0, -1);
        const parentNode = nodeMap.get(parentSymbol);

        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = [];
          }
          parentNode.children.push(node);
        } else {
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  }

  onNodeSelect(event: any) {
    this.selectedWykazAkt = event.node.data;
  }

  close() {
    this.closeRequested.emit();
  }
}
