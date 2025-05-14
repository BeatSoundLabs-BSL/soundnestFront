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

  // Additional methods that match the MockRoomService

  /**
   * Get all available rooms
   * @returns Observable of available rooms
   */
  getAvailableRooms(): Observable<Room[]> {
    // Using the getAll method from BaseService and filtering the results
    return this.getAll().pipe(
      map(rooms => rooms.filter(room => room.isAvailable))
    );
  }

  /**
   * Get rooms with capacity greater than or equal to minCapacity
   * @param minCapacity The minimum capacity required
   * @returns Observable of rooms meeting the capacity requirement
   */
  getRoomsByCapacity(minCapacity: number): Observable<Room[]> {
    return this.getAll().pipe(
      map(rooms => rooms.filter(room => room.capacity >= minCapacity))
    );
  }

  /**
   * Update room availability
   * @param roomId The ID of the room to update
   * @param isAvailable The new availability status
   * @returns Observable of the updated room
   */
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

  /**
   * Get featured rooms (in this implementation, the top 3 rooms with highest capacity)
   * @returns Observable of featured rooms
   */
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
