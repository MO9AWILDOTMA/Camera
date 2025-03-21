import { createReducer, on } from '@ngrx/store';
import { ScreeningRoomState, initialScreeningRoomState } from '../states/screening-room.state';
import * as ScreeningRoomActions from '../actions/screening-room.action';

export const screeningRoomReducer = createReducer(
  initialScreeningRoomState,
  // Load Screening Rooms
  on(ScreeningRoomActions.loadScreeningRooms, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ScreeningRoomActions.loadScreeningRoomsSuccess, (state, { screeningRooms }) => ({
    ...state,
    screeningRooms,
    loading: false,
    error: null,
  })),
  on(ScreeningRoomActions.loadScreeningRoomsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Screening Room
  on(ScreeningRoomActions.addScreeningRoom, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ScreeningRoomActions.addScreeningRoomSuccess, (state, { screeningRoom }) => ({
    ...state,
    screeningRooms: [...state.screeningRooms, screeningRoom],
    loading: false,
    error: null,
  })),
  on(ScreeningRoomActions.addScreeningRoomFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Screening Room
  on(ScreeningRoomActions.updateScreeningRoom, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ScreeningRoomActions.updateScreeningRoomSuccess, (state, { screeningRoom }) => ({
    ...state,
    screeningRooms: state.screeningRooms.map((sr) => (sr.id === screeningRoom.id ? screeningRoom : sr)),
    loading: false,
    error: null,
  })),
  on(ScreeningRoomActions.updateScreeningRoomFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Screening Room
  on(ScreeningRoomActions.deleteScreeningRoom, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ScreeningRoomActions.deleteScreeningRoomSuccess, (state, { id }) => ({
    ...state,
    screeningRooms: state.screeningRooms.filter((screeningRoom) => screeningRoom.id !== id),
    loading: false,
    error: null,
  })),
  on(ScreeningRoomActions.deleteScreeningRoomFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
