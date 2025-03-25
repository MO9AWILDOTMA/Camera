import Showtime from "../../models/showtime.model";

export interface ShowtimeState {
  showtimes: Showtime[];
  loading: boolean;
  error: string | null;
}

export const initialShowtimeState: ShowtimeState = {
  showtimes: [],
  loading: false,
  error: null,
};
