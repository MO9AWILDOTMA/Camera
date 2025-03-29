import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Showtime from '../models/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  constructor() { }

  getShowtimes() {
    return new Observable
  }

  createShowtime(showtime: Partial<Showtime>) {
    return new Observable
  }

  updateShowtime(id: number, showtime: Partial<Showtime>) {
    return new Observable
  }

  deleteShowtime(id: number) {
    return new Observable
  }
}
