import { createSelector } from '@ngrx/store';
import { ScreeningRoomState } from '../states/screening-room.state';
import ScreeningRoom from '../../models/screening-room.model';

export const selectScreeningRoomState = (state: { screeningRoom: ScreeningRoomState }) => state.screeningRoom;

export const selectScreeningRooms = createSelector(
  selectScreeningRoomState,
  (state: ScreeningRoomState) => state.screeningRooms
);

export const selectScreeningRoomLoading = createSelector(
  selectScreeningRoomState,
  (state: ScreeningRoomState) => state.loading
);

export const selectScreeningRoomError = createSelector(
  selectScreeningRoomState,
  (state: ScreeningRoomState) => state.error
);

export const selectScreeningRoomById = (id: number) =>
  createSelector(selectScreeningRooms, (screeningRooms: ScreeningRoom[]) =>
    screeningRooms.find((screeningRoom) => screeningRoom.id === id)
  );

export const selectAvailableScreeningRooms = createSelector(
  selectScreeningRooms,
  (screeningRooms: ScreeningRoom[]) =>
    screeningRooms.filter((screeningRoom) => screeningRoom.isAvailable)
);

export const selectScreeningRoomsByCapacity = (minCapacity: number) =>
  createSelector(selectScreeningRooms, (screeningRooms: ScreeningRoom[]) =>
    screeningRooms.filter((screeningRoom) => screeningRoom.capacity >= minCapacity)
  );
