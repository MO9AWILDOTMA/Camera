import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth.reducer';
import { MovieState, movieReducer } from './movie.reducer';
import { ShowtimeState, showtimeReducer } from './showtime.reducer';
import { ReservationState, reservationReducer } from './reservation.reducer';
import { UserState, userReducer } from './user.reducer';
import { RoleState, roleReducer } from './role.reducer';
import { DiscountState, discountReducer } from './discount.reducer';
import { PaymentState, paymentReducer } from './payment.reducer';
import { ScreeningRoomState, screeningRoomReducer } from './screening-room.reducer';

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
