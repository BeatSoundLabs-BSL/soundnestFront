import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {Room} from '../../soundnest/model/room.entity';

@Injectable({
  providedIn: 'root'
})
export class MockRoomService {
  private rooms: Room[] = [
    {
      id: 1,
      name: 'Sala de Conferencias A',
      capacity: 50,
      description: 'Sala grande con equipo audiovisual completo',
      isAvailable: true,
      price: 100,
    },
    {
      id: 2,
      name: 'Sala de Reuniones B',
      capacity: 10,
      description: 'Sala pequeña para reuniones ejecutivas',
      isAvailable: true,
      price: 50,
    },
    {
      id: 3,
      name: 'Auditorio Principal',
      capacity: 200,
      description: 'Auditorio con escenario y sistema de sonido profesional',
      isAvailable: false,
      price: 300,
    },
    {
      id: 4,
      name: 'Sala de Formación C',
      capacity: 30,
      description: 'Sala equipada para formaciones y talleres',
      isAvailable: true,
      price: 80,
    },
    {
      id: 5,
      name: 'Sala de Videoconferencias',
      capacity: 8,
      description: 'Sala con equipamiento para videoconferencias',
      isAvailable: true,
      price: 60,
    }
  ];

  // Simulate API delay
  private delay = 500;

  getAll(): Observable<Room[]> {
    return of([...this.rooms]).pipe(delay(this.delay));
  }

  getById(id: number): Observable<Room> {
    const room = this.rooms.find(r => r.id === id);
    if (room) {
      return of({...room}).pipe(delay(this.delay));
    }
    throw new Error('Room not found');
  }

  create(room: Room): Observable<Room> {
    const newRoom = {
      ...room,
      id: this.getNextId(),
      pricePerHour: room.price // Ensure pricePerHour is set from price
    };
    this.rooms.push(newRoom);
    return of({...newRoom}).pipe(delay(this.delay));
  }

  update(id: number, updatedRoom: Room): Observable<Room> {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index !== -1) {

      this.rooms[index] = { ...updatedRoom };
      return of({...this.rooms[index]}).pipe(delay(this.delay));
    }
    throw new Error('Room not found');
  }

  delete(id: number): Observable<any> {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rooms.splice(index, 1);
      return of(new HttpResponse({ status: 200 })).pipe(delay(this.delay));
    }
    throw new Error('Room not found');
  }

  // Additional methods matching RoomService
  getAvailableRooms(): Observable<Room[]> {
    return of(this.rooms.filter(room => room.isAvailable)).pipe(delay(this.delay));
  }

  getRoomsByCapacity(minCapacity: number): Observable<Room[]> {
    return of(this.rooms.filter(room => room.capacity >= minCapacity)).pipe(delay(this.delay));
  }

  updateAvailability(roomId: number, isAvailable: boolean): Observable<Room> {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.isAvailable = isAvailable;
      return of({...room}).pipe(delay(this.delay));
    }
    throw new Error('Room not found');
  }

  getFeaturedRooms(): Observable<Room[]> {
    // For mock purposes, return the top 3 rooms with highest capacity
    return of([...this.rooms]
      .sort((a, b) => b.capacity - a.capacity)
      .slice(0, 3)
    ).pipe(delay(this.delay));
  }

  // Helper method to get next ID for a new room
  private getNextId(): number {
    return Math.max(...this.rooms.map(room => room.id), 0) + 1;
  }
}
