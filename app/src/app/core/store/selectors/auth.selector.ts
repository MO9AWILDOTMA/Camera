import { createSelector } from '@ngrx/store';
import { AuthState } from '../states/auth.state';
import { User } from '../models/user.model';

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user: User | null) => !!user
);
