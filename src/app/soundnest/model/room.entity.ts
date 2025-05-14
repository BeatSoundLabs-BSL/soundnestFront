export class Room {
  id: number;
  capacity: string;
  description: string;
  isAvailable: boolean;

  constructor(room: {id?: number, capacity?: string, description?: string, isAvailable?: boolean}) {
    this.id = room.id || 0;
    this.capacity = room.capacity || ' ';
    this.description = room.description || ' ';
    this.isAvailable = room.isAvailable || false;
  }
}
