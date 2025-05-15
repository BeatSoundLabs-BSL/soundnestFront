import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Room } from '../model/room.entity';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends BaseService<Room> {
  constructor() {
    super();
    //this.serverBaseUrl = `${environment.serverBaseUrl}`;
    this.resourceEndpoint = '/rooms';
  }

  getAvailableRooms(): Observable<Room[]> {
    return this.getAll().pipe(
      map(rooms => rooms.filter(room => room.isAvailable))
    );
  }

  getRoomsByCapacity(minCapacity: number): Observable<Room[]> {
    return this.getAll().pipe(
      map(rooms => rooms.filter(room => room.capacity >= minCapacity))
    );
  }

  getRoomsByCreator(userId: number): Observable<Room[]> {
    return this.getAll().pipe(
      map(rooms => rooms.filter(room => room.createdBy === userId))
    );
  }

  updateAvailability(roomId: number, isAvailable: boolean): Observable<Room> {
    // First get the room, then update its availability
    return this.getById(roomId).pipe(
      map(room => {
        const updatedRoom = { ...room, isAvailable };
        this.update(roomId, updatedRoom).subscribe();
        return updatedRoom;
      })
    );
  }
  getByIds(ids: number[]): Observable<Room[]> {
    if (ids.length === 0) {
      return of([]);
    }

    return this.getAll().pipe(
      map(rooms => rooms.filter(room => ids.includes(room.id)))
    );
  }
  getFeaturedRooms(): Observable<Room[]> {
    return this.getAll().pipe(
      map(rooms =>
        [...rooms]
          .sort((a, b) => b.capacity - a.capacity)
          .slice(0, 3)
      )
    );
  }



}
