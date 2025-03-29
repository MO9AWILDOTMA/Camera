import { Injectable } from '@angular/core';
import Reservation from '../models/reservation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor() { }

   getReservations() {
      return new Observable
    }

    createReservation(reservation: Partial<Reservation>) {
      return new Observable
    }

    updateReservation(id: number, reservation: Partial<Reservation>) {
      return new Observable
    }

    deleteReservation(id: number) {
      return new Observable
    }
}
