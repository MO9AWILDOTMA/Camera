import ScreeningRoom from "../../models/screening-room.model";

export interface ScreeningRoomState {
  screeningRooms: ScreeningRoom[];
  loading: boolean;
  error: string | null;
}

export const initialScreeningRoomState: ScreeningRoomState = {
  screeningRooms: [],
  loading: false,
  error: null,
};
