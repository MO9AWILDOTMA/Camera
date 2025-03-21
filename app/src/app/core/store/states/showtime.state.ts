import Showtime from "../../models/showtime.model";

export interface ShowtimesState {
  Showtimes: Showtime[];
  loading: boolean;
  error: string | null;
}

export const initialShowtimesState: ShowtimesState = {
  Showtimes: [],
  loading: false,
  error: null,
};
