import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ScreeningRoomActions from '../actions/screening-room.action';
import { ScreeningRoomService } from '../../services/screening-room.service';

@Injectable()
export class ScreeningRoomEffects {
  loadScreeningRooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScreeningRoomActions.loadScreeningRooms),
      mergeMap(() =>
        this.screeningroomService.getScreeningRooms().pipe(
          map((screeningRooms: any) => ScreeningRoomActions.loadScreeningRoomsSuccess({ screeningRooms })),
          catchError((error) =>
            of(ScreeningRoomActions.loadScreeningRoomsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addScreeningRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScreeningRoomActions.addScreeningRoom),
      mergeMap((screeningRoom ) =>
        this.screeningroomService.createScreeningRoom(screeningRoom).pipe(
          map((newScreeningRoom: any) => ScreeningRoomActions.addScreeningRoomSuccess({ screeningRoom: newScreeningRoom })),
          catchError((error) =>
            of(ScreeningRoomActions.addScreeningRoomFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateScreeningRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScreeningRoomActions.updateScreeningRoom),
      mergeMap(({ id, screeningRoom }) =>
        this.screeningroomService.updateScreeningRoom(id, screeningRoom).pipe(
          map((updatedScreeningRoom: any) =>
            ScreeningRoomActions.updateScreeningRoomSuccess({ screeningRoom: updatedScreeningRoom })
          ),
          catchError((error) =>
            of(ScreeningRoomActions.updateScreeningRoomFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteScreeningRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScreeningRoomActions.deleteScreeningRoom),
      mergeMap(({ id }) =>
        this.screeningroomService.deleteScreeningRoom(id).pipe(
          map(() => ScreeningRoomActions.deleteScreeningRoomSuccess({ id })),
          catchError((error) =>
            of(ScreeningRoomActions.deleteScreeningRoomFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private screeningroomService: ScreeningRoomService
  ) {}
}
