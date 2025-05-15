export class Reservation {
  id: number;
  roomId: number;
  userId: number;
  date: Date;

  constructor(reservation: { id?: number; roomId?: number; userId?: number; date?: string | Date }) {
    this.id = reservation.id || 0;
    this.roomId = reservation.roomId || 0;
    this.userId = reservation.userId || 0;
    this.date = reservation.date ? new Date(reservation.date) : new Date(); // default: hoy
  }
}
