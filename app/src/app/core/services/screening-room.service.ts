import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ScreeningRoom from '../models/screening-room.model';

@Injectable({
  providedIn: 'root'
})
export class ScreeningRoomService {

  constructor() { }

  getScreeningRooms() {
    return new Observable
  }

  createScreeningRoom(screeningroom: any) {
    return new Observable
  }

  updateScreeningRoom(id: number, screeningroom: Partial<ScreeningRoom>) {
    return new Observable
  }

  deleteScreeningRoom(id: number) {
    return new Observable
  }
}
