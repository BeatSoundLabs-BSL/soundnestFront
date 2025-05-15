import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Reservation } from '../../../soundnest/model/reservation.entity';
import { ReservationService} from '../../../soundnest/services/reservation.service';
import {RoomService} from '../../../soundnest/services/room.service';
import {AuthService} from '../../../soundnest/services/user-auth.service';
import { Room } from '../../../soundnest/model/room.entity';
import { tap, switchMap } from 'rxjs';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-owner-reservations-table',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    SidebarComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  @ViewChild('reservationActions') reservationActionsTemplate!: TemplateRef<any>;

  columns = [
    { field: 'id', header: 'ID Reserva', width: '90px', sortable: true },
    { field: 'roomName', header: 'Sala', sortable: true },
    { field: 'userId', header: 'Usuario', sortable: true },
    { field: 'date', header: 'Fecha', sortable: true }
  ];

  reservations: (Reservation & { roomName: string })[] = [];
  pagedReservations: (Reservation & { roomName: string })[] = [];
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
    this.roomService.getRoomsByCreator(this.currentUserId).pipe(
      switchMap((rooms: Room[]) => {
        const roomIds = rooms.map(r => r.id);
        return this.reservationService.getAll().pipe(
          tap((allReservations: Reservation[]) => {
            this.reservations = allReservations
              .filter(r => roomIds.includes(r.roomId))
              .map(r => ({
                ...r,
                roomName: rooms.find(room => room.id === r.roomId)?.name || 'Sala desconocida'
              }));
            this.totalReservations = this.reservations.length;
            this.pagedReservations = this.getPagedReservations();
            this.loading = false;
          })
        );
      })
    ).subscribe();
  }

  getPagedReservations(): (Reservation & { roomName: string })[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const sorted = [...this.reservations].sort((a, b) => {
      const fieldA = a[this.sortField as keyof Reservation] as any;
      const fieldB = b[this.sortField as keyof Reservation] as any;

      if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted.slice(startIndex, endIndex);
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
}
