import { Injectable } from '@angular/core';
import Role from '../models/role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  getRoles() {
    return new Observable
  }

  createRole(role: any) {
    return new Observable
  }

  updateRole(id:number, role: Partial<Role>) {
    return new Observable
  }

  deleteRole(id:number) {
    return new Observable
  }
}
