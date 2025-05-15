import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../model/reservation.entity';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/user-auth.service';
import { Room } from '../../model/room.entity';
import { tap, switchMap } from 'rxjs';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    SidebarComponent
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

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.currentUserValue?.id || 0;
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
}
