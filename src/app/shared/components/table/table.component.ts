import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [
    NgClass,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() columns: Array<{
    field: string;
    header: string;
    sortable?: boolean;
    width?: string;
  }> = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() selectable: boolean = false;
  @Input() sortField: string | null = null;
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  @Output() rowClick = new EventEmitter<any>();
  @Output() sort = new EventEmitter<{field: string, order: string}>();
  @Output() selectionChange = new EventEmitter<any[]>();

  @ContentChild('rowActions') rowActionsTemplate: TemplateRef<any> | null = null;

  selectedItems: any[] = [];

  ngOnInit(): void {
    // Initialization logic
  }

  toggleSelection(item: any, event: any): void {
    event.stopPropagation();

    const index = this.selectedItems.findIndex(selected => selected === item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }

    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  onRowClick(item: any): void {
    this.rowClick.emit(item);
  }

  onSortClick(column: any): void {
    if (!column.sortable) return;

    const order = this.sortField === column.field && this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sort.emit({ field: column.field, order });
  }

  getSortIcon(column: any): string {
    if (!column.sortable) return '';
    if (this.sortField !== column.field) return 'fa-sort';
    return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
}
