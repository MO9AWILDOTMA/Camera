import { createSelector } from '@ngrx/store';
import User from '../../models/user.model';
import { UserState } from '../states/user.state';

export const selectUserState = (state: { user: UserState }) => state.user;

export const selectUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectUserById = (id: number) =>
  createSelector(selectUsers, (users: User[]) =>
    users.find((user) => user.id === id)
  );

export const selectUsersByRole = (roleId: number) =>
  createSelector(selectUsers, (users: User[]) =>
    users.filter((user) => user.roles.filter(r => r.id = roleId))
  );
