export class Room {
  id: number;
  name: string;
  capacity: number;
  description: string;
  price: number;
  isAvailable: boolean;
  createdBy: number;

  constructor(room: {id?: number,name?:string, capacity?: number, description?: string,price?:number, isAvailable?: boolean, createdBy?: number}) {
    this.id = room.id || 0;
    this.name = room.name || ' ';
    this.capacity = room.capacity || 0;
    this.description = room.description || ' ';
    this.price = room.price|| 0;
    this.isAvailable = room.isAvailable || false;
    this.createdBy = room.createdBy || 0;
  }
}
