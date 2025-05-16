import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReservationService} from '../../services/reservation.service';
import {Reservation} from '../../model/reservation.entity';
import {MatCard} from '@angular/material/card';


@Component({
  selector: 'app-reservations-summary',
  imports: [
    MatCard
  ],
  templateUrl: './reservation-summary.component.html',
  styleUrl: './reservation-summary.component.css'
})
export class ReservationSummaryComponent implements OnInit{
  @Output() resumenClick = new EventEmitter<'today' | 'future'>();
  onCardClick(type: 'today' | 'future') {
    this.resumenClick.emit(type);
  }
  hoyCount = 0;
  proximasCount = 0;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadResumen();
  }

  loadResumen(): void {
    this.reservationService.getAll().subscribe(reservations => {
      const today = new Date().toISOString().split('T')[0];

      this.hoyCount = reservations.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return resDate === today;
      }).length;

      this.proximasCount = reservations.filter(res => {
        const resDate = new Date(res.date).toISOString().split('T')[0];
        return resDate > today;
      }).length;
    });
  }
}
