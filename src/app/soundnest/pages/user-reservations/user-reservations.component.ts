import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation.entity';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/user-auth.service';
import { Room } from '../../model/room.entity';
import { tap, switchMap } from 'rxjs';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import {UserSidebarComponent} from '../../../shared/components/user-sidebar/user-sidebar.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    UserSidebarComponent,
    FormsModule
  ],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.css'
})
export class UserReservationsComponent implements OnInit {
  columns = [
    { field: 'id', header: 'ID Reserva', width: '90px', sortable: true },
    { field: 'roomName', header: 'Sala', sortable: true },
    { field: 'date', header: 'Fecha', sortable: true },
    { field: 'status', header: 'Estado', sortable: true }
  ];

  reservations: (Reservation & { roomName: string, status: string })[] = [];
  pagedReservations: (Reservation & { roomName: string, status: string })[] = [];
  currentUserId = 0;
  totalReservations = 0;
  currentPage = 1;
  itemsPerPage = 5;
  sortField = 'date';
  sortOrder: 'asc' | 'desc' = 'asc';
  loading = false;

  showReservationModal = false;
  dateSelected = false;
  minDate: string;
  availableRooms: Room[] = [];
  allRooms: Room[] = [];
  newReservation: Partial<Reservation> = {
    userId: 0,
    roomId: 0,
    date: ''
  };

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.currentUserValue?.id || 0;
    this.newReservation.userId = this.currentUserId;
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;

    this.reservationService.getReservationsByUser(this.currentUserId).pipe(
      switchMap((userReservations: Reservation[]) => {
        const roomIds = [...new Set(userReservations.map(r => r.roomId))];

        return this.roomService.getByIds(roomIds).pipe(
          tap((rooms: Room[]) => {
            const now = new Date();

            this.reservations = userReservations.map(r => {
              const reservationDate = new Date(r.date);
              let status = 'Pendiente';
              if (reservationDate < now) {
                status = 'Completada';
              } else if (this.isSameDay(reservationDate, now)) {
                status = 'Hoy';
              }

              return {
                ...r,
                roomName: rooms.find(room => room.id === r.roomId)?.name || 'Sala desconocida',
                status: status
              };
            });

            this.totalReservations = this.reservations.length;
            this.pagedReservations = this.getPagedReservations();
            this.loading = false;
          })
        );
      })
    ).subscribe();
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  getPagedReservations(): (Reservation & { roomName: string, status: string })[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const sorted = [...this.reservations].sort((a, b) => {
      const fieldA = this.getSortValue(a, this.sortField);
      const fieldB = this.getSortValue(b, this.sortField);

      if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted.slice(startIndex, endIndex);
  }

  getSortValue(reservation: any, field: string): any {
    if (field === 'roomName' || field === 'status') {
      return reservation[field];
    }
    return reservation[field as keyof Reservation];
  }

  onSort(event: { field: string, order: string }): void {
    this.sortField = event.field;
    this.sortOrder = event.order as 'asc' | 'desc';
    this.pagedReservations = this.getPagedReservations();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.pagedReservations = this.getPagedReservations();
  }

  onItemsPerPageChange(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.pagedReservations = this.getPagedReservations();
  }

  cancelReservation(id: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservationService.delete(id).subscribe(() => {
        this.loadReservations();
      });
    }
  }

  openNewReservationModal(): void {
    this.resetNewReservation();
    this.showReservationModal = true;
  }

  closeNewReservationModal(): void {
    this.showReservationModal = false;
    this.resetNewReservation();
  }

  resetNewReservation(): void {
    this.newReservation = {
      userId: this.currentUserId,
      roomId: 0,
      date: ''
    };
    this.dateSelected = false;
    this.availableRooms = [];
  }

  onDateSelected(): void {
    if (!this.newReservation.date) {
      this.dateSelected = false;
      this.availableRooms = [];
      return;
    }

    this.dateSelected = true;
    this.loadAvailableRooms();
  }

  loadAvailableRooms(): void {
    if (!this.newReservation.date) return;

    const selectedDate = new Date(this.newReservation.date).toISOString().split('T')[0];

    this.reservationService.getReservationsByDate(selectedDate).subscribe(reservations => {
      const reservedRoomIds = reservations.map(r => r.roomId);
      this.availableRooms = this.allRooms.filter(room => !reservedRoomIds.includes(room.id));
    });
  }

  createReservation(): void {
    if (!this.newReservation.roomId || !this.newReservation.date) {
      return;
    }

    const reservation: Reservation = {
      id: 0,
      userId: this.currentUserId,
      roomId: this.newReservation.roomId as number,
      date: new Date(this.newReservation.date).toISOString()
    };

    this.reservationService.create(reservation).subscribe({
      next: () => {
        this.closeNewReservationModal();
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
      }
    });
  }

}
