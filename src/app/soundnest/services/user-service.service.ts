import { Injectable } from '@angular/core';
import { User } from '../model/user.entity';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  constructor() {
    super();
    this.resourceEndpoint = '/users';
  }
}
