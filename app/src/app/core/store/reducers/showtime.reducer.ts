import { createReducer, on } from '@ngrx/store';
import { ShowtimeState, initialShowtimeState } from '../states/showtime.state';
import * as ShowtimeActions from '../actions/showtime.action';

export const showtimeReducer = createReducer(
  initialShowtimeState,
  // Load Showtimes
  on(ShowtimeActions.loadShowtimes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ShowtimeActions.loadShowtimesSuccess, (state, { showtimes }) => ({
    ...state,
    showtimes,
    loading: false,
    error: null,
  })),
  on(ShowtimeActions.loadShowtimesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Showtime
  on(ShowtimeActions.addShowtime, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ShowtimeActions.addShowtimeSuccess, (state, { showtime }) => ({
    ...state,
    showtimes: [...state.showtimes, showtime],
    loading: false,
    error: null,
  })),
  on(ShowtimeActions.addShowtimeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Showtime
  on(ShowtimeActions.updateShowtime, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ShowtimeActions.updateShowtimeSuccess, (state, { showtime }) => ({
    ...state,
    showtimes: state.showtimes.map((s) => (s.id === showtime.id ? showtime : s)),
    loading: false,
    error: null,
  })),
  on(ShowtimeActions.updateShowtimeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Showtime
  on(ShowtimeActions.deleteShowtime, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ShowtimeActions.deleteShowtimeSuccess, (state, { id }) => ({
    ...state,
    showtimes: state.showtimes.filter((showtime) => showtime.id !== id),
    loading: false,
    error: null,
  })),
  on(ShowtimeActions.deleteShowtimeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
