import { createAction, props } from '@ngrx/store';
import ScreeningRoom from '../../models/screening-room.model';

// Load Screening Rooms
export const loadScreeningRooms = createAction('[ScreeningRoom] Load Screening Rooms');
export const loadScreeningRoomsSuccess = createAction(
  '[ScreeningRoom] Load Screening Rooms Success',
  props<{ screeningRooms: ScreeningRoom[] }>()
);
export const loadScreeningRoomsFailure = createAction(
  '[ScreeningRoom] Load Screening Rooms Failure',
  props<{ error: string }>()
);

// Add Screening Room
export const addScreeningRoom = createAction(
  '[ScreeningRoom] Add Screening Room',
  props<{ screeningRoom: Partial<ScreeningRoom> }>()
);
export const addScreeningRoomSuccess = createAction(
  '[ScreeningRoom] Add Screening Room Success',
  props<{ screeningRoom: ScreeningRoom }>()
);
export const addScreeningRoomFailure = createAction(
  '[ScreeningRoom] Add Screening Room Failure',
  props<{ error: string }>()
);

// Update Screening Room
export const updateScreeningRoom = createAction(
  '[ScreeningRoom] Update Screening Room',
  props<{ id: number; screeningRoom: Partial<ScreeningRoom> }>()
);
export const updateScreeningRoomSuccess = createAction(
  '[ScreeningRoom] Update Screening Room Success',
  props<{ screeningRoom: ScreeningRoom }>()
);
export const updateScreeningRoomFailure = createAction(
  '[ScreeningRoom] Update Screening Room Failure',
  props<{ error: string }>()
);

// Delete Screening Room
export const deleteScreeningRoom = createAction(
  '[ScreeningRoom] Delete Screening Room',
  props<{ id: number }>()
);
export const deleteScreeningRoomSuccess = createAction(
  '[ScreeningRoom] Delete Screening Room Success',
  props<{ id: number }>()
);
export const deleteScreeningRoomFailure = createAction(
  '[ScreeningRoom] Delete Screening Room Failure',
  props<{ error: string }>()
);
