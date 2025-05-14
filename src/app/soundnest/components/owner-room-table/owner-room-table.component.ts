import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {Room} from '../../model/room.entity';
import {RoomService} from '../../services/room.service';
import {tap} from 'rxjs';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {TableComponent} from '../../../shared/components/table/table.component';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {SidebarComponent} from '../../../shared/components/sidebar/sidebar.component';


@Component({
  selector: 'app-owner-room-table',
  templateUrl: './owner-room-table.component.html',
  imports: [
    PaginationComponent,
    TableComponent,
    FormsModule,
    SidebarComponent,
    NgIf
  ],
  styleUrls: ['./owner-room-table.component.css']
})
export class ownerRoomsTable implements OnInit {
  @ViewChild('roomActions') roomActionsTemplate!: TemplateRef<any>;

  columns = [
    { field: 'id', header: 'ID', width: '70px', sortable: true },
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'capacity', header: 'Capacidad', sortable: true, width: '100px' },
    { field: 'price', header: 'Precio', sortable: true, width: '120px' },
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

  roomName = '';
  roomCapacity = 0;
  roomDescription = '';
  roomIsAvailable = false;
  roomPrice = 0;

  constructor(
    private router: Router,
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAll().pipe(
      tap(rooms => {
        this.rooms = rooms;
        this.totalRooms = rooms.length;
        this.pagedRooms = this.getPagedRooms();
      }),
      tap(() => this.loading = false)
    ).subscribe();
  }
  getPagedRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    let filteredRooms = [...this.rooms];

    if (this.filterText) {
      const filter = this.filterText.toLowerCase();
      filteredRooms = filteredRooms.filter(room =>
        room.capacity.toString().toLowerCase().includes(filter) ||
        room.description.toLowerCase().includes(filter) ||
        room.isAvailable.toString().toLowerCase().includes(filter)
      );
    }
    filteredRooms.sort((a, b) => {
      const fieldA = a[this.sortField as keyof Room];
      const fieldB = b[this.sortField as keyof Room];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return this.sortOrder === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        // Handle numbers and booleans
        if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    this.totalRooms = filteredRooms.length; // update total after filter.
    return filteredRooms.slice(startIndex, endIndex);
  }


  onSort(event: {field: string, order: string}): void {
    this.sortField = event.field;
    this.sortOrder = event.order as 'asc' | 'desc';
    this.pagedRooms = this.getPagedRooms();
  }

  onRowClick(room: Room): void {
    this.router.navigate(['/rooms', room.id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.pagedRooms = this.getPagedRooms();
  }

  onItemsPerPageChange(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.pagedRooms = this.getPagedRooms();
  }

  onFilterChange(text: string): void {
    this.filterText = text;
    this.currentPage = 1;
    this.pagedRooms = this.getPagedRooms();
  }

  clearFilter(): void {
    this.filterText = '';
    this.pagedRooms = this.getPagedRooms();
  }

  openAddRoomModal(): void {
    this.editingRoom = null;
    this.resetFormFields();
    this.showAddRoomModal = true;
  }

  openEditRoomModal(room: Room, event: Event): void {
    event.stopPropagation();
    this.editingRoom = {...room};
    this.roomName = this.editingRoom.name;
    this.roomCapacity = this.editingRoom.capacity;
    this.roomPrice = this.editingRoom.price;
    this.roomDescription = this.editingRoom.description;
    this.roomIsAvailable = this.editingRoom.isAvailable;
    this.showAddRoomModal = true;
  }

  closeRoomModal(): void {
    this.showAddRoomModal = false;
  }

  saveRoom(): void {
    const roomData = {
      name: this.roomName,
      capacity: this.roomCapacity,
      price: this.roomPrice,
      description: this.roomDescription,
      isAvailable: this.roomIsAvailable
    };

    if (this.editingRoom) {
      // Update existing room
      const updatedRoom = { ...this.editingRoom, ...roomData };

      this.roomService.update(updatedRoom.id, updatedRoom).pipe(
        tap(() => this.loadRooms()),
        tap(() => this.closeRoomModal()),
        tap(() => this.loading = false)
      ).subscribe();
    } else {
      const newRoom: Room = {
        id: 0,
        ...roomData
      };

      this.roomService.create(newRoom).pipe(
        tap(() => this.loadRooms()),
        tap(() => this.closeRoomModal()),
        tap(() => this.loading = false)
      ).subscribe();
    }
  }

  deleteRoom(room: Room, event: Event): void {
    event.stopPropagation(); // Prevent row click when deleting
    if (confirm(`¿Estás seguro de que deseas eliminar esta sala: ${room.name}?`)) {
      this.loading = true;
      this.roomService.delete(room.id).pipe(
        tap(() => this.loadRooms()), // Reload rooms after deletion
        tap(() => this.loading = false)
      ).subscribe();
    }
  }

  resetFormFields(): void {
    this.roomName = '';
    this.roomCapacity = 0;
    this.roomPrice = 0;
    this.roomDescription = '';
    this.roomIsAvailable = false;
  }
}
