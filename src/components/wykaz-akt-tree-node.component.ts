import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WykazAktTreeNode, WykazAkt } from '../models/wykaz-akt.model';

@Component({
  selector: 'app-wykaz-akt-tree-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tree-node">
      <div
        class="node-content"
        [class.selected]="isSelected"
        [class.level-1]="node.data.poziom === 1"
        [class.level-2]="node.data.poziom === 2"
        [class.level-3]="node.data.poziom === 3"
        [class.level-4]="node.data.poziom === 4"
        [style.padding-left.px]="getPaddingLeft()"
        (click)="handleNodeClick()"
      >
        <span
          class="expand-icon"
          *ngIf="hasChildren()"
          [class.expanded]="node.expanded"
        >
          ▶
        </span>
        <span class="expand-placeholder" *ngIf="!hasChildren()"></span>

        <span class="node-label">{{ node.data.symbol }} - {{ node.data.nazwa }}</span>
      </div>

      <div class="children" *ngIf="hasChildren() && node.expanded">
        <app-wykaz-akt-tree-node
          *ngFor="let child of node.children"
          [node]="child"
          [selectedNode]="selectedNode"
          (nodeSelected)="onChildNodeSelected($event)"
        ></app-wykaz-akt-tree-node>
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
      cursor: pointer;
      border-radius: 4px;
      margin: 1px 0;
      transition: all 0.15s ease;
      padding: 6px 8px;
    }

    .node-content:hover {
      background-color: #f1f5f9;
    }

    .node-content.selected {
      background-color: #dbeafe;
      border-left: 3px solid #2563eb;
    }

    .node-content.level-1 {
      font-weight: 700;
      color: #1e293b;
      font-size: 14px;
    }

    .node-content.level-2 {
      font-weight: 600;
      color: #334155;
      font-size: 13px;
    }

    .node-content.level-3 {
      font-weight: 500;
      color: #475569;
      font-size: 13px;
    }

    .node-content.level-4 {
      font-weight: 400;
      color: #64748b;
      font-size: 12px;
    }

    .expand-icon {
      transition: transform 0.2s ease;
      font-size: 10px;
      color: #64748b;
      width: 16px;
      text-align: center;
      flex-shrink: 0;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .expand-placeholder {
      width: 16px;
      flex-shrink: 0;
    }

    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .children {
      animation: slideDown 0.15s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 1000px;
      }
    }
  `]
})
export class WykazAktTreeNodeComponent {
  @Input() node!: WykazAktTreeNode;
  @Input() selectedNode: WykazAkt | null = null;
  @Output() nodeSelected = new EventEmitter<WykazAkt>();

  get isSelected(): boolean {
    return this.selectedNode?.symbol === this.node.data.symbol;
  }

  handleNodeClick() {
    if (this.hasChildren()) {
      this.node.expanded = !this.node.expanded;
    }
    this.nodeSelected.emit(this.node.data);
  }

  onChildNodeSelected(wykazAkt: WykazAkt) {
    this.nodeSelected.emit(wykazAkt);
  }

  hasChildren(): boolean {
    return this.node.children.length > 0;
  }

  getPaddingLeft(): number {
    return 8 + (this.node.data.poziom - 1) * 16;
  }
}
