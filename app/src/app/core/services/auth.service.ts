import { Injectable } from '@angular/core';
import User from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email:string, password: string) {
 return new Observable
  }

  register(user: Partial<User>) {
    return new Observable
  }

  logout() {
    return new Observable
  }
}
