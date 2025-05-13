import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  totalPages: number = 1;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculateTotalPages();
      this.generatePagesArray();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  generatePagesArray(): void {
    // Show a max of 5 page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.pageChange.emit(page);
    this.generatePagesArray();
  }

  setItemsPerPage(event: any): void {
    const newSize = parseInt(event.target.value, 10);
    if (newSize !== this.itemsPerPage) {
      this.itemsPerPage = newSize;
      this.itemsPerPageChange.emit(newSize);
      this.calculateTotalPages();
      this.setPage(1); // Reset to first page
    }
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get hasPrevious(): boolean {
    return this.currentPage > 1;
  }

  get hasNext(): boolean {
    return this.currentPage < this.totalPages;
  }
}
