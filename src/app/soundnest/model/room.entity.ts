export class Room {
  id: string;
  capacity: string;
  description: string;
  isAvailable: boolean;

  constructor() {
    this.id = '';
    this.capacity = '';
    this.description = '';
    this.isAvailable = false;
  }
}
