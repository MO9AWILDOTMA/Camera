import Reservation from "./reservation.model";
import Role from "./role.model";

export default interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  picture?: string;
  roles: Role[];
  enable: boolean;
}
