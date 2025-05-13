import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {Room} from '../../model/room.entity';


@Component({
  selector: 'app-owner-room-table',
  templateUrl: './owner-room-table.component.html',
  styleUrls: ['./owner-room-table.component.scss']
})
export class RoomListComponent implements OnInit {
  @ViewChild('roomActions') roomActionsTemplate!: TemplateRef<any>;

  columns = [
    { field: 'id', header: 'ID', width: '70px', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'capacity', header: 'Capacidad', sortable: true, width: '100px' },
    { field: 'pricePerHour', header: 'Precio/Hora', sortable: true, width: '120px' },
    { field: 'isAvailable', header: 'Disponible', sortable: true, width: '100px' }
  ];

  rooms: Room[] = [];
  pagedRooms: Room[] = [];
  totalRooms = 0;
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  sortField = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  filterText = '';
  showAddRoomModal = false;
  editingRoom: Room | null = null;

  constructor(

    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
  }

  onSort(event: {field: string, order: string}): void {
    this.sortField = event.field;
    this.sortOrder = event.order as 'asc' | 'desc';

  }

  onRowClick(room: Room): void {
    this.router.navigate(['/rooms', room.id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;

  }

  onItemsPerPageChange(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
  }

  onFilterChange(text: string): void {
    this.filterText = text;
    this.currentPage = 1; // Reset to first page when filter changes
  }

  clearFilter(): void {
    this.filterText = '';
  }

  openAddRoomModal(): void {
    this.editingRoom = null;
    this.showAddRoomModal = true;
  }

  openEditRoomModal(room: Room, event: Event): void {
    event.stopPropagation();
    this.editingRoom = {...room};
    this.showAddRoomModal = true;
  }

  closeRoomModal(): void {
    this.showAddRoomModal = false;
  }

  saveRoom(room: Room): void {
    this.loading = true;

    if (this.editingRoom) {

    } else {

    }
  }
  deleteRoom(room: Room, event: Event): void {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar esta sala"?`)) {
      this.loading = true;
    }
  }
}
