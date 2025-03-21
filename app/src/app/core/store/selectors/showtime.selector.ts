import { createReducer, on } from '@ngrx/store';
import * as ShowtimeActions from "../actions/showtime.action"
import { ShowtimesState, initialShowtimesState } from '../states/showtime.state';
import { createSelector } from '@ngrx/store';
import Showtime from '../../models/showtime.model';

export const ShowtimesReducer = createReducer(
  initialShowtimesState,

  // Load Showtimes
  on(ShowtimeActions.loadShowtimes, (state) => ({ ...state, loading: true })),
  on(ShowtimeActions.loadShowtimesSuccess, (state, { Showtimes }) => ({ ...state, loading: false, Showtimes })),
  on(ShowtimeActions.loadShowtimesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Add Showtime
  on(ShowtimeActions.addShowtimeSuccess, (state, { Showtime }) => ({
    ...state,
    Showtimes: [...state.Showtimes, Showtime]
  })),

  // Update Showtime
  on(ShowtimeActions.updateShowtimeSuccess, (state, { Showtime }) => ({
    ...state,
    Showtimes: state.Showtimes.map(m => m.id === Showtime.id ? Showtime : m)
  })),

  // Delete Showtime
  on(ShowtimeActions.deleteShowtimeSuccess, (state, { id }) => ({
    ...state,
    Showtimes: state.Showtimes.filter(m => m.id !== id)
  }))
);

export const selectShowtimeState = (state: { showtime: ShowtimesState }) => state.showtime;

export const selectShowtimes = createSelector(
  selectShowtimeState,
  (state: ShowtimesState) => state.showtimes
);

export const selectShowtimeLoading = createSelector(
  selectShowtimeState,
  (state: ShowtimesState) => state.loading
);

export const selectShowtimeError = createSelector(
  selectShowtimeState,
  (state: ShowtimesState) => state.error
);

export const selectShowtimeById = (id: number) =>
  createSelector(selectShowtimes, (showtimes: Showtime[]) =>
    showtimes.find((showtime) => showtime.id === id)
  );

export const selectShowtimesByMovieId = (movieId: number) =>
  createSelector(selectShowtimes, (showtimes: Showtime[]) =>
    showtimes.filter((showtime) => showtime.movieId === movieId)
  );
