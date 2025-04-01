export default interface ScreeningRoom {
  id: number;
  name: string;
  slug: string;
  totalSeats: number;
  picturePaths: string[];
  seats: Seat[]
}

export type Seat = {
  id: string;
  row: string;
  number: number;
  status: "AVAILABLE" | "RESERVED" | "SELECTED" | "UNAVAILABLE";
};
