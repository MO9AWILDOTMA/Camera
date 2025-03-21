import { createAction, props } from '@ngrx/store';
import Showtime from '../../models/showtime.model';

// Load Showtimes
export const loadShowtimes = createAction('[Showtime] Load Showtimes');
export const loadShowtimesSuccess = createAction(
  '[Showtime] Load Showtimes Success',
  props<{ showtimes: Showtime[] }>()
);
export const loadShowtimesFailure = createAction(
  '[Showtime] Load Showtimes Failure',
  props<{ error: string }>()
);

// Add Showtime
export const addShowtime = createAction(
  '[Showtime] Add Showtime',
  props<{ showtime: Partial<Showtime> }>()
);
export const addShowtimeSuccess = createAction(
  '[Showtime] Add Showtime Success',
  props<{ showtime: Showtime }>()
);
export const addShowtimeFailure = createAction(
  '[Showtime] Add Showtime Failure',
  props<{ error: string }>()
);

// Update Showtime
export const updateShowtime = createAction(
  '[Showtime] Update Showtime',
  props<{ id: number; showtime: Partial<Showtime> }>()
);
export const updateShowtimeSuccess = createAction(
  '[Showtime] Update Showtime Success',
  props<{ showtime: Showtime }>()
);
export const updateShowtimeFailure = createAction(
  '[Showtime] Update Showtime Failure',
  props<{ error: string }>()
);

// Delete Showtime
export const deleteShowtime = createAction(
  '[Showtime] Delete Showtime',
  props<{ id: number }>()
);
export const deleteShowtimeSuccess = createAction(
  '[Showtime] Delete Showtime Success',
  props<{ id: number }>()
);
export const deleteShowtimeFailure = createAction(
  '[Showtime] Delete Showtime Failure',
  props<{ error: string }>()
);
