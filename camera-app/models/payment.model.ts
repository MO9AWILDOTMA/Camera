import { GlobalStatus } from "./enums/global.status.enum";
import Reservation from "./reservation.model";
import User from "./user.model";

export default interface Payment {
  id: number;
  amount: number;
  reservation:Reservation;
  user: User;
  status: GlobalStatus;
  transaction: object
}
