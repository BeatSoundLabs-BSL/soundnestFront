import { Component } from '@angular/core';
import {SidebarComponent} from '../../../shared/components/sidebar/sidebar.component';
import {
  ReservationSummaryComponent
} from '../../../soundnest/components/reservation-summary/reservation-summary.component';
import {UserRoomTableComponent} from '../../../soundnest/components/user-room-table/user-room-table.component';

@Component({
  selector: 'app-ownerDashboard',
  imports: [
    SidebarComponent,
    ReservationSummaryComponent,
    UserRoomTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedFilterMode: 'today' | 'future' = 'today';

  onResumenCardClick(mode: 'today' | 'future') {
    this.selectedFilterMode = mode;
  }
}
