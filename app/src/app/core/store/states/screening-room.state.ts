import ScreeningRoom from "../../models/screening-room.model";

export interface ScreeningRoomsState {
  ScreeningRooms: ScreeningRoom[];
  loading: boolean;
  error: string | null;
}

export const initialScreeningRoomsState: ScreeningRoomsState = {
  ScreeningRooms: [],
  loading: false,
  error: null,
};
