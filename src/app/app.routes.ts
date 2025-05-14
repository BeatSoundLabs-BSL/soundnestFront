import { Routes } from '@angular/router';
import {DashboardComponent} from "./public/pages/dashboard/dashboard.component";
import {ReservationsComponent} from "./public/pages/reservations/reservations.component";
import {CalendarComponent} from "./public/pages/calendar/calendar.component";
import {ownerRoomsTable} from "./soundnest/components/owner-room-table/owner-room-table.component";
import {AlertsComponent} from "./public/pages/alerts/alerts.component";
import {HistoryComponent} from "./public/pages/history/history.component";
import {SettingsComponent} from "./public/pages/settings/settings.component";
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {LoginComponent} from './soundnest/components/login/login.component';
import {authGuard, ownerGuard} from './soundnest/services/authGuard.service';

export const routes: Routes = [
  { path: '',                 component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login',             component: LoginComponent },
  { path: 'dashboard',             component: DashboardComponent },
  { path: 'reservations',            component: ReservationsComponent },
  { path: 'calendar',            component: CalendarComponent },
  { path: 'room-list',            component: ownerRoomsTable },
  { path: 'alerts',            component: AlertsComponent },
  { path: 'history',            component: HistoryComponent },
  { path: 'settings',            component: SettingsComponent },
  { path: '**',               component: PageNotFoundComponent }
];
