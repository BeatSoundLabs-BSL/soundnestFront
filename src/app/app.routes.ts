import { Routes } from '@angular/router';
import {DashboardComponent} from './public/pages/ownerDashboard/dashboard.component';
import { ReservationsComponent } from "./public/pages/reservations/reservations.component";
import { CalendarComponent } from "./public/pages/calendar/calendar.component";
import { ownerRoomsTable } from "./soundnest/components/owner-room-table/owner-room-table.component";
import { AlertsComponent } from "./public/pages/alerts/alerts.component";
import { HistoryComponent } from "./public/pages/history/history.component";
import { SettingsComponent } from "./public/pages/settings/settings.component";
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { LoginComponent } from './soundnest/components/login/login.component';
import { RegisterComponent } from './soundnest/components/register/register.component';
import { authGuard, ownerGuard } from './soundnest/services/authGuard.service';
import {UserDashboardComponent} from './soundnest/pages/user-dashboard/user-dashboard.component';
import {UserReservationsComponent} from './soundnest/pages/user-reservations/user-reservations.component';

export const routes: Routes = [
  { path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: UserDashboardComponent
      }
    ]},
  { path: 'login',             component: LoginComponent },
  { path: 'register',          component: RegisterComponent },
  { path: 'owner/dashboard',             component: DashboardComponent, canActivate: [ownerGuard] },
  { path: 'owner/reservations',            component: ReservationsComponent, canActivate: [ownerGuard] },
  { path: 'owner/calendar',            component: CalendarComponent, canActivate: [ownerGuard] },
  { path: 'owner/room-list',            component: ownerRoomsTable, canActivate: [ownerGuard] },
  { path: 'owner/alerts',            component: AlertsComponent, canActivate: [ownerGuard] },
  { path: 'owner/history',            component: HistoryComponent, canActivate: [ownerGuard] },
  { path: 'owner/settings',            component: SettingsComponent, canActivate: [ownerGuard] },
  { path: 'user/dashboard',             component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'user/reservations',            component: UserReservationsComponent, canActivate: [authGuard] },
  { path: '**',               component: PageNotFoundComponent}
];
