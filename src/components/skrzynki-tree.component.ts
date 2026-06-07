import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './tree-node.component';
import { SkrzynkiService } from '../services/skrzynki.service';
import { Skrzynka, TreeNode } from '../models/skrzynka.model';
import { TSkrzynki } from '../models/enums.model';

@Component({
  selector: 'app-skrzynki-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  template: `
    <div class="tree-container">
      <div class="tree-header">
        <h2 class="tree-title">
          <span class="title-icon">📁</span>
          Skrzynki
        </h2>
        <button 
          class="refresh-button"
          (click)="loadData()"
          [disabled]="loading"
        >
          <span class="refresh-icon" [class.spinning]="loading">↻</span>
        </button>
      </div>
      
      <div class="tree-content" *ngIf="!loading && treeNodes.length > 0">
        <app-tree-node
          *ngFor="let node of treeNodes"
          [node]="node"
          [selectedSkrzynka]="selectedSkrzynka"
          (nodeSelected)="onNodeSelected($event)"
        ></app-tree-node>
      </div>
      
      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Ładowanie skrzynek...</p>
      </div>
      
      <div class="empty-state" *ngIf="!loading && treeNodes.length === 0">
        <div class="empty-icon">📭</div>
        <p>Brak dostępnych skrzynek</p>
      </div>
    </div>
  `,
  styles: [`
    .tree-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--bg-subtle), var(--bg-muted));
      border-bottom: 1px solid var(--border-default);
    }

    .tree-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .title-icon {
      font-size: 24px;
    }

    .refresh-button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .refresh-button:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .refresh-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .refresh-icon {
      font-size: 16px;
      transition: transform 0.5s ease;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .tree-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .tree-content::-webkit-scrollbar {
      width: 6px;
    }

    .tree-content::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 3px;
    }

    .tree-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 3px;
    }

    .tree-content::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }

    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 40px 20px;
      color: var(--text-muted);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-default);
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-state p,
    .empty-state p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .tree-header {
        padding: 16px 20px;
      }

      .tree-title {
        font-size: 18px;
      }

      .tree-content {
        padding: 12px;
      }
    }
  `]
})
export class SkrzynkiTreeComponent implements OnInit {
  @Output() skrzynkaSelected = new EventEmitter<Skrzynka>();
  
  treeNodes: TreeNode[] = [];
  loading = false;
  selectedSkrzynka: Skrzynka | null = null;

  constructor(private skrzynkiService: SkrzynkiService) {}

  ngOnInit() {
    this.loadData();
  }

  onNodeSelected(skrzynka: Skrzynka) {
    this.selectedSkrzynka = skrzynka;
    this.skrzynkaSelected.emit(skrzynka);
  }

  loadData() {
    this.loading = true;
    this.skrzynkiService.getSkrzynki().subscribe({
      next: (skrzynki) => {
        this.treeNodes = this.buildTree(skrzynki);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading skrzynki:', error);
        this.loading = false;
      }
    });
  }

  refreshAndSelectBiezace() {
    this.loading = true;
    this.skrzynkiService.getSkrzynki().subscribe({
      next: (skrzynki) => {
        this.treeNodes = this.buildTree(skrzynki);
        this.loading = false;
        const biezace = skrzynki.find(s => s.skrzynka === TSkrzynki.tps_PBiezace);
        if (biezace) {
          this.selectedSkrzynka = biezace;
          this.skrzynkaSelected.emit(biezace);
        }
      },
      error: (error) => {
        console.error('Error loading skrzynki:', error);
        this.loading = false;
      }
    });
  }

  private buildTree(skrzynki: Skrzynka[]): TreeNode[] {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    skrzynki.forEach(skrzynka => {
      const node: TreeNode = {
        data: skrzynka,
        children: [],
        expanded: true
      };
      nodeMap.set(skrzynka.skrzynka, node);
    });

    skrzynki.forEach(skrzynka => {
      const node = nodeMap.get(skrzynka.skrzynka)!;

      if (skrzynka.poziom === 1) {
        rootNodes.push(node);
      } else if (skrzynka.poziom === 2 || skrzynka.poziom === 3) {
        const parentNode = this.findParentNode(skrzynka, skrzynki, nodeMap);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  }

  private findParentNode(
    currentItem: Skrzynka,
    allItems: Skrzynka[],
    nodeMap: Map<string, TreeNode>
  ): TreeNode | null {
    const currentIndex = allItems.indexOf(currentItem);
    const targetLevel = currentItem.poziom - 1;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (allItems[i].poziom === targetLevel) {
        return nodeMap.get(allItems[i].skrzynka) || null;
      }
    }

    return null;
  }
}