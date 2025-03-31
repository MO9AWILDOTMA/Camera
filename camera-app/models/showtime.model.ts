import Discount from "./discount.model";
import Movie from "./movie.model";
import ScreeningRoom from "./screening-room.model";

export default interface Showtime {
  id: number;
  slug: string;
  dateTime: string;
  price: number;
  movie: Movie;
  discounts: Discount[];
  showVersion: ShowVersion;
  screeningRoom: ScreeningRoom;
  totalSeats: number;
  reservedSeats: number;
  isPreview: boolean;
  isSpecialEvent: boolean
}

export enum ShowVersion {
  VO = "VO",
  VOST_FR = "VOST_FR",
  VOST_EN = "VOST_EN",
}


