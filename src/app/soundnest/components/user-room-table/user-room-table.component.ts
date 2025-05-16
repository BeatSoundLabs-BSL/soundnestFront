import {Component, Input, OnInit} from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import {UserService} from '../../services/user-service.service';
import { Reservation } from '../../model/reservation.entity';
import { User } from '../../model/user.entity';
import {Room} from '../../model/room.entity';
import {RoomService} from '../../services/room.service';
import {TableComponent} from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-user-room-table',
  templateUrl: './user-room-table.component.html',
  imports: [
    TableComponent
  ],
  styleUrls: ['./user-room-table.component.css']
})
export class UserRoomTableComponent implements OnInit {
  columns = [
    { field: 'roomName', header: 'Sala', sortable: true },
    { field: 'userName', header: 'Usuario', sortable: true }
  ];

  data: Array<{ roomName: string; userName: string }> = [];
  loading = false;

  tableData: Array<{ roomName: string; userName: string }> = [];

  private reservations: Reservation[] = [];
  private users: User[] = [];
  private rooms: Room[] = [];

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private roomService: RoomService
  ) {}

  @Input() filterMode: 'today' | 'future' = 'today';

  ngOnChanges(): void {
    if (this.users.length && this.rooms.length) {
      this.loadReservations(this.filterMode);
    }
  }

  ngOnInit(): void {
    this.loading = true;

    // Load users and rooms in parallel first
    Promise.all([
      this.userService.getAll().toPromise(),
      this.roomService.getAll().toPromise()
    ])
      .then(([users, rooms]) => {
        this.users = users ?? [];
        this.rooms = rooms ?? [];
        this.loadReservations('today');
      })
      .catch(err => console.error('Error loading users or rooms', err));
  }

  loadReservations(mode: 'today' | 'future'): void {
    const today = new Date().toISOString().split('T')[0];

    this.reservationService.getAll().subscribe(reservations => {
      const filtered = reservations.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return mode === 'today' ? resDate === today : resDate > today;
      });

      this.data = filtered.map(res => {
        const user = this.users.find(u => u.id === res.userId);
        const room = this.rooms.find(r => r.id === res.roomId);
        return {
          roomName: room?.name || `Sala ${res.roomId}`,
          userName: user?.name || `Usuario ${res.userId}`
        };
      });

      this.loading = false;
    });
  }

  onResumenCardClick(mode: 'today' | 'future'): void {
    this.loading = true;
    this.loadReservations(mode);
  }
}
