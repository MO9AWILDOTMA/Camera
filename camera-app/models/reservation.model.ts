import { GlobalStatus } from "./enums/global.status.enum";
import Payment from "./payment.model";
import Showtime from "./showtime.model";
import Ticket from "./ticket.model";

export default interface Reservation {
  id: number;
  showtime: Showtime;
  tickets: Ticket[]
  seats: string[];
  status: GlobalStatus
  createdAt: string;
  payment: Payment
}
