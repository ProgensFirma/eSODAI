import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode, Skrzynka } from '../models/skrzynka.model';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  template: `
    <div class="tree-node" [class.expanded]="node.expanded">
      <div 
        class="node-content" 
        [class.level-0]="node.data.poziom === 1"
        [class.level-1]="node.data.poziom === 2"
        [class.level-2]="node.data.poziom === 3"
        (click)="handleNodeClick()"
      >
        <div class="node-info">
          <span 
            class="expand-icon" 
            *ngIf="hasChildren()"
            [class.expanded]="node.expanded"
          >
            ▶
          </span>
          
          <span class="node-icon" [class]="getIconClass()">
            {{ getIcon() }}
          </span>
          
          <span class="node-name">{{ node.data.nazwa }}</span>
          
          <span 
            class="node-count" 
            *ngIf="node.data.zliczana && node.data.ilosc > 0"
            [class.warning]="isWarning()"
          >
            {{ node.data.ilosc }}
          </span>
        </div>
      </div>
      
      <div class="children" *ngIf="hasChildren() && node.expanded">
        <app-tree-node 
          *ngFor="let child of node.children" 
          [node]="child"
          (nodeSelected)="onChildNodeSelected($event)"
        ></app-tree-node>
      </div>
    </div>
  `,
  styles: [`
    .tree-node {
      user-select: none;
    }

    .node-content {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 6px;
      margin: 2px 0;
      transition: all 0.2s ease;
      position: relative;
    }

    .node-content:hover {
      background-color: #f1f5f9;
      transform: translateX(2px);
    }

    .node-content.level-0 {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      font-weight: 600;
      margin: 8px 0;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }

    .node-content.level-0:hover {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      transform: translateX(0);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .node-content.level-1 {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      font-weight: 500;
      color: #1e293b;
      margin-left: 16px;
    }

    .node-content.level-2 {
      margin-left: 32px;
      padding-left: 24px;
      border-left: 2px solid #e2e8f0;
    }

    .node-info {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .expand-icon {
      transition: transform 0.2s ease;
      font-size: 12px;
      color: #64748b;
      width: 16px;
      text-align: center;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .node-content.level-0 .expand-icon {
      color: rgba(255, 255, 255, 0.8);
    }

    .node-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .icon-folder {
      color: #f59e0b;
    }

    .icon-document {
      color: #3b82f6;
    }

    .icon-email {
      color: #16a34a;
    }

    .icon-urgent {
      color: #dc2626;
    }

    .node-name {
      flex: 1;
      font-size: 14px;
    }

    .node-content.level-0 .node-name {
      font-size: 15px;
    }

    .node-count {
      background: linear-gradient(135deg, #16a34a, #22c55e);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    .node-count.warning {
      background: linear-gradient(135deg, #ea580c, #f97316);
    }

    .children {
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .node-content.level-1 {
        margin-left: 8px;
      }

      .node-content.level-2 {
        margin-left: 16px;
        padding-left: 16px;
      }

      .node-name {
        font-size: 13px;
      }
    }
  `]
})
export class TreeNodeComponent implements OnInit {
  @Input() node!: TreeNode;
  @Output() nodeSelected = new EventEmitter<Skrzynka>();

  ngOnInit() {
    // Level 1 nodes start collapsed by default
  }

  handleNodeClick() {
    if (this.hasChildren()) {
      this.node.expanded = !this.node.expanded;
    }

    // Emit the selected node for document types
    if (this.node.data.typ === 'ts_pisma' || this.node.data.typ === 'ts_sprawy' || this.node.data.typ === 'ts_korespEl') {
      this.nodeSelected.emit(this.node.data);
    }
  }

  onChildNodeSelected(skrzynka: Skrzynka) {
    this.nodeSelected.emit(skrzynka);
  }

  hasChildren(): boolean {
    return this.node.children.length > 0;
  }

  getIcon(): string {
    switch (this.node.data.typ) {
      case 'ts_brak':
        return '📁';
      case 'ts_sprawy':
        return this.isUrgent() ? '🔥' : '📋';
      case 'ts_korespEl':
        return '📧';
      case 'ts_pisma':
        return '📄';
      default:
        return '📁';
    }
  }

  getIconClass(): string {
    switch (this.node.data.typ) {
      case 'ts_brak':
        return 'icon-folder';
      case 'ts_sprawy':
        return this.isUrgent() ? 'icon-urgent' : 'icon-document';
      case 'ts_korespEl':
        return 'icon-email';
      case 'ts_pisma':
        return 'icon-document';
      default:
        return 'icon-folder';
    }
  }

  private isUrgent(): boolean {
    return this.node.data.nazwa.toLowerCase().includes('pilne') || 
           this.node.data.nazwa.toLowerCase().includes('przeterminowane');
  }

  isWarning(): boolean {
    return this.isUrgent() && this.node.data.ilosc > 0;
  }
}