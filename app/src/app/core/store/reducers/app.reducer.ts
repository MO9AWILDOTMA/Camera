import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from './auth.reducer';
import { movieReducer } from './movie.reducer';
import { showtimeReducer } from './showtime.reducer';
import { reservationReducer } from './reservation.reducer';
import { userReducer } from './user.reducer';
import { roleReducer } from './role.reducer';
import { discountReducer } from './discount.reducer';
import { paymentReducer } from './payment.reducer';
import { screeningRoomReducer } from './screening-room.reducer';
import { AuthState } from '../states/auth.state';
import { MovieState } from '../states/movie.state';
import { ShowtimeState } from '../states/showtime.state';
import { UserState } from '../states/user.state';
import { ScreeningRoomState } from '../states/screening-room.state';
import { ReservationState } from '../states/reservation.state';
import { RoleState } from '../states/role.state';
import { DiscountState } from '../states/discount.state';
import { PaymentState } from '../states/payment.state';

export interface AppState {
  auth: AuthState;
  movies: MovieState;
  showtimes: ShowtimeState;
  reservations: ReservationState;
  users: UserState;
  roles: RoleState;
  discounts: DiscountState;
  payments: PaymentState;
  screeningRooms: ScreeningRoomState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  movies: movieReducer,
  showtimes: showtimeReducer,
  reservations: reservationReducer,
  users: userReducer,
  roles: roleReducer,
  discounts: discountReducer,
  payments: paymentReducer,
  screeningRooms: screeningRoomReducer
};
