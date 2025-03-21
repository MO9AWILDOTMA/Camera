import { createReducer, on } from '@ngrx/store';
import { RoleState, initialRoleState } from '../states/role.state';
import * as RoleActions from '../actions/role.action';

export const roleReducer = createReducer(
  initialRoleState,
  // Load Roles
  on(RoleActions.loadRoles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RoleActions.loadRolesSuccess, (state, { roles }) => ({
    ...state,
    roles,
    loading: false,
    error: null,
  })),
  on(RoleActions.loadRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Role
  on(RoleActions.addRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RoleActions.addRoleSuccess, (state, { role }) => ({
    ...state,
    roles: [...state.roles, role],
    loading: false,
    error: null,
  })),
  on(RoleActions.addRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Role
  on(RoleActions.updateRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RoleActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    roles: state.roles.map((r) => (r.id === role.id ? role : r)),
    loading: false,
    error: null,
  })),
  on(RoleActions.updateRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Role
  on(RoleActions.deleteRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RoleActions.deleteRoleSuccess, (state, { id }) => ({
    ...state,
    roles: state.roles.filter((role) => role.id !== id),
    loading: false,
    error: null,
  })),
  on(RoleActions.deleteRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
