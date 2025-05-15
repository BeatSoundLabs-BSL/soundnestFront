import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Reservation } from '../model/reservation.entity';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReservationService extends BaseService<Reservation> {
  constructor() {
    super();
    this.resourceEndpoint = '/reservations';
  }

  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.getAll().pipe(
      map(reservations => reservations.filter(res => res.userId === userId))
    );
  }

  getReservationsByRoom(roomId: number): Observable<Reservation[]> {
    return this.getAll().pipe(
      map(reservations => reservations.filter(res => res.roomId === roomId))
    );
  }

  getReservationsByDate(date: string): Observable<Reservation[]> {
    return this.getAll().pipe(
      map(reservations =>
        reservations.filter(res => {
          const resDate = new Date(res.date).toISOString().split('T')[0];
          return resDate === date;
        })
      )
    );
  }

  isRoomReservedOnDate(roomId: number, date: string): Observable<boolean> {
    return this.getReservationsByRoom(roomId).pipe(
      map(reservations => {
        return reservations.some(res => {
          const resDate = new Date(res.date).toISOString().split('T')[0];
          return resDate === date;
        });
      })
    );
  }
}
