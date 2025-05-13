import { Routes } from '@angular/router';
import {DashboardComponent} from "./public/pages/dashboard/dashboard.component";
import {ReservationsComponent} from "./public/pages/reservations/reservations.component";
import {CalendarComponent} from "./public/pages/calendar/calendar.component";
import {RoomListComponent} from "./public/pages/room-list/room-list.component";
import {AlertsComponent} from "./public/pages/alerts/alerts.component";
import {HistoryComponent} from "./public/pages/history/history.component";
import {SettingsComponent} from "./public/pages/settings/settings.component";
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  { path: 'dashboard',             component: DashboardComponent },
  { path: 'reservations',            component: ReservationsComponent },
  { path: 'calendar',            component: CalendarComponent },
  { path: 'room-list',            component: RoomListComponent },
  { path: 'alerts',            component: AlertsComponent },
  { path: 'history',            component: HistoryComponent },
  { path: 'settings',            component: SettingsComponent },
  { path: '',                 redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**',               component: PageNotFoundComponent }
];
