import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ShowtimeActions from '../actions/showtime.action';
import { ShowtimeService } from '../../services/showtime.service'

@Injectable()
export class ShowtimeEffects {
  loadShowtimes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShowtimeActions.loadShowtimes),
      mergeMap(() =>
        this.showtimeService.getShowtimes().pipe(
          map((showtimes) => ShowtimeActions.loadShowtimesSuccess({ showtimes })),
          catchError((error) =>
            of(ShowtimeActions.loadShowtimesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addShowtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShowtimeActions.addShowtime),
      mergeMap(({ showtime }) =>
        this.showtimeService.createShowtime(showtime).pipe(
          map((newShowtime) => ShowtimeActions.addShowtimeSuccess({ showtime: newShowtime })),
          catchError((error) =>
            of(ShowtimeActions.addShowtimeFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateShowtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShowtimeActions.updateShowtime),
      mergeMap(({ id, showtime }) =>
        this.showtimeService.updateShowtime(id, showtime).pipe(
          map((updatedShowtime) =>
            ShowtimeActions.updateShowtimeSuccess({ showtime: updatedShowtime })
          ),
          catchError((error) =>
            of(ShowtimeActions.updateShowtimeFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteShowtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShowtimeActions.deleteShowtime),
      mergeMap(({ id }) =>
        this.showtimeService.deleteShowtime(id).pipe(
          map(() => ShowtimeActions.deleteShowtimeSuccess({ id })),
          catchError((error) =>
            of(ShowtimeActions.deleteShowtimeFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private showtimeService: ShowtimeService
  ) {}
}
