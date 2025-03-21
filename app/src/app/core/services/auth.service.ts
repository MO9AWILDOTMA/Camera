import { Injectable } from '@angular/core';
import User from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email:string, password: string) {

  }

  register(user: User) {

  }

  logout() {

  }
}
