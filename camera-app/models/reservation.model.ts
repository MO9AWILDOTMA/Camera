import { GlobalStatus } from "./enums/global.status.enum";
import Showtime from "./showtime.model";
import Ticket from "./ticket.model";

export default interface Reservation {
  id: number;
  showtime: Showtime;
  ticket: Ticket
  seat: string;
  status: GlobalStatus
}
