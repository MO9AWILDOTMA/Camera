import Reservation from "../../models/reservation.model";

export interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

export const initialReservationState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};
