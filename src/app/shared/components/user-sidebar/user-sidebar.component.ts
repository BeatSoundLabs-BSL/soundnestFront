import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../soundnest/services/user-auth.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { path: '/user/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/user/reservations', icon: 'fa-calendar-check', label: 'Reservations' },
    { path: '/user/history', icon: 'fa-history', label: 'History' },
    { path: '/userr/settings', icon: 'fa-cog', label: 'Settings' }
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

