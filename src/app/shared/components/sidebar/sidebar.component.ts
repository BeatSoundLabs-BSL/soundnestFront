import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../soundnest/services/user-auth.service';

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
    { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/reservations', icon: 'fa-calendar-check', label: 'Reservations' },
    { path: '/room-list', icon: 'fa-door-open', label: 'Rooms' },
    { path: '/calendar', icon: 'fa-calendar-alt', label: 'Calendar' },
    { path: '/alerts', icon: 'fa-bell', label: 'Alerts' },
    { path: '/history', icon: 'fa-history', label: 'History' },
    { path: '/settings', icon: 'fa-cog', label: 'Settings' }
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
