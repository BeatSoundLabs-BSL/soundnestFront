import { Component } from '@angular/core';
import {UserSidebarComponent} from '../../../shared/components/user-sidebar/user-sidebar.component';
import {SidebarComponent} from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-dashboard',
  imports: [UserSidebarComponent, SidebarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
