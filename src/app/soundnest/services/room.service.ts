import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {Room} from '../model/room.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends BaseService<Room> {
  constructor() {
    super();
    this.resourceEndpoint = '/rooms';
  }
}
