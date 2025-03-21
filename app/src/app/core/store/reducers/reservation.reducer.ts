import { createReducer, on } from '@ngrx/store';
import { ReservationState, initialReservationState } from '../states/reservation.state';
import * as ReservationActions from '../actions/reservation.action';

export const reservationReducer = createReducer(
  initialReservationState,
  // Load Reservations
  on(ReservationActions.loadReservations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    reservations,
    loading: false,
    error: null,
  })),
  on(ReservationActions.loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Reservation
  on(ReservationActions.addReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.addReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: [...state.reservations, reservation],
    loading: false,
    error: null,
  })),
  on(ReservationActions.addReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Reservation
  on(ReservationActions.updateReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.updateReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: state.reservations.map((r) => (r.id === reservation.id ? reservation : r)),
    loading: false,
    error: null,
  })),
  on(ReservationActions.updateReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Reservation
  on(ReservationActions.deleteReservation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReservationActions.deleteReservationSuccess, (state, { id }) => ({
    ...state,
    reservations: state.reservations.filter((reservation) => reservation.id !== id),
    loading: false,
    error: null,
  })),
  on(ReservationActions.deleteReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
