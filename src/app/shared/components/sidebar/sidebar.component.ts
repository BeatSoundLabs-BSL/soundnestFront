import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../soundnest/services/user-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { path: '/owner/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/owner/reservations', icon: 'fa-calendar-check', label: 'Reservations' },
    { path: '/owner/room-list', icon: 'fa-door-open', label: 'Rooms' },
    { path: '/owner/calendar', icon: 'fa-calendar-alt', label: 'Calendar' },
    { path: '/owner/alerts', icon: 'fa-bell', label: 'Alerts' },
    { path: '/owner/history', icon: 'fa-history', label: 'History' },
    { path: '/owner/settings', icon: 'fa-cog', label: 'Settings' }
  ];

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
