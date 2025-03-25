import { Injectable } from '@angular/core';
import User from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers() {
    return new Observable
  }

  createUser(user: Partial<User>) {
    return new Observable
  }

  updateUser(id: number, user: Partial<User>) {
    return new Observable
  }

  deleteUser(id: number) {
    return new Observable
  }
}
