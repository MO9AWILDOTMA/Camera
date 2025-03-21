import { createSelector } from '@ngrx/store';
import { ReservationState } from '../states/reservation.state';
import Reservation from '../../models/reservation.model';

export const selectReservationState = (state: { reservation: ReservationState }) => state.reservation;

export const selectReservations = createSelector(
  selectReservationState,
  (state: ReservationState) => state.reservations
);

export const selectReservationLoading = createSelector(
  selectReservationState,
  (state: ReservationState) => state.loading
);

export const selectReservationError = createSelector(
  selectReservationState,
  (state: ReservationState) => state.error
);

export const selectReservationById = (id: number) =>
  createSelector(selectReservations, (reservations: Reservation[]) =>
    reservations.find((reservation) => reservation.id === id)
  );

export const selectReservationsByUserId = (userId: number) =>
  createSelector(selectReservations, (reservations: Reservation[]) =>
    reservations.filter((reservation) => reservation.userId === userId)
  );

export const selectReservationsByShowtimeId = (showtimeId: number) =>
  createSelector(selectReservations, (reservations: Reservation[]) =>
    reservations.filter((reservation) => reservation.showtimeId === showtimeId)
  );
