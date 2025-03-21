import Reservation from "../../models/reservation.model";

export interface ReservationsState {
  Reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

export const initialReservationsState: ReservationsState = {
  Reservations: [],
  loading: false,
  error: null,
};
