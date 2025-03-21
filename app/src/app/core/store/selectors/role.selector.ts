import { createSelector } from '@ngrx/store';
import { RoleState } from '../states/role.state';
import Role from '../../models/role.model';

export const selectRoleState = (state: { role: RoleState }) => state.role;

export const selectRoles = createSelector(
  selectRoleState,
  (state: RoleState) => state.roles
);

export const selectRoleLoading = createSelector(
  selectRoleState,
  (state: RoleState) => state.loading
);

export const selectRoleError = createSelector(
  selectRoleState,
  (state: RoleState) => state.error
);

export const selectRoleById = (id: number) =>
  createSelector(selectRoles, (roles: Role[]) =>
    roles.find((role) => role.id === id)
  );

export const selectRoleByName = (name: string) =>
  createSelector(selectRoles, (roles: Role[]) =>
    roles.find((role) => role.name === name)
  );
