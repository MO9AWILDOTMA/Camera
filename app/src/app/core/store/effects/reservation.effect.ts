import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ReservationActions from '../actions/reservation.action';
import { ReservationService } from '../../services/reservation.service';

@Injectable()
export class ReservationEffects {
  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.loadReservations),
      mergeMap(() =>
        this.reservationService.getReservations().pipe(
          map((reservations) => ReservationActions.loadReservationsSuccess({ reservations })),
          catchError((error) =>
            of(ReservationActions.loadReservationsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.addReservation),
      mergeMap(({ reservation }) =>
        this.reservationService.createReservation(reservation).pipe(
          map((newReservation) => ReservationActions.addReservationSuccess({ reservation: newReservation })),
          catchError((error) =>
            of(ReservationActions.addReservationFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.updateReservation),
      mergeMap(({ id, reservation }) =>
        this.reservationService.updateReservation(id, reservation).pipe(
          map((updatedReservation) =>
            ReservationActions.updateReservationSuccess({ reservation: updatedReservation })
          ),
          catchError((error) =>
            of(ReservationActions.updateReservationFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationActions.deleteReservation),
      mergeMap(({ id }) =>
        this.reservationService.deleteReservation(id).pipe(
          map(() => ReservationActions.deleteReservationSuccess({ id })),
          catchError((error) =>
            of(ReservationActions.deleteReservationFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}
}
