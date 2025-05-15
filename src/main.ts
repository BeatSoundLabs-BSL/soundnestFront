import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import {ownerRoomsTable} from "./app/soundnest/components/owner-room-table/owner-room-table.component";
import {RoomService} from './app/soundnest/services/room.service';
import {appConfig} from './app/app.config';
import {importProvidersFrom} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {routes} from './app/app.routes';
import {ReservationService} from './app/soundnest/services/reservation.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    RoomService,
    ReservationService,
    importProvidersFrom(TranslateModule.forRoot()),
    provideRouter(routes)
    // Add other providers as needed
  ]
}).catch(err => console.error(err));
