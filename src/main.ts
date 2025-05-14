import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import {RoomListComponent} from "./app/soundnest/components/owner-room-table/owner-room-table.component";
import {MockRoomService} from './app/public/services/mock-room.service';
import {RoomService} from './app/soundnest/services/room.service';

// Define routes including the test page
const routes = [
  { path: '', redirectTo: 'test-rooms', pathMatch: 'full' },
  { path: 'test-rooms', component:  RoomListComponent},
  // Add other routes as needed
];

bootstrapApplication(AppComponent, {
  providers: [
    //provideHttpClient(),
    { provide: RoomService, useClass: MockRoomService },
    //provideRouter(routes),
    // Add other providers as needed
  ]
}).catch(err => console.error(err));
