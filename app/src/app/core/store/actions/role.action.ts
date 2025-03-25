import { createAction, props } from '@ngrx/store';
import Role from '../../models/role.model';


// Load (Read) Roles
export const loadRoles = createAction('[Roles] Load Roles');
export const loadRolesSuccess = createAction('[Roles] Load Roles Success', props<{ roles: Role[] }>());
export const loadRolesFailure = createAction('[Roles] Load Roles Failure', props<{ error: string }>());

// Create Role
export const addRole = createAction('[Roles] Add Role', props<{ Role: Role }>());
export const addRoleSuccess = createAction('[Roles] Add Role Success', props<{ role: Role }>());
export const addRoleFailure = createAction('[Roles] Add Role Failure', props<{ error: string }>());

// Update Role
export const updateRole = createAction('[Roles] Update Role', props<{ id:number, role: Role }>());
export const updateRoleSuccess = createAction('[Roles] Update Role Success', props<{ role: Role }>());
export const updateRoleFailure = createAction('[Roles] Update Role Failure', props<{ error: string }>());

// Delete Role
export const deleteRole = createAction('[Roles] Delete Role', props<{ id: number }>());
export const deleteRoleSuccess = createAction('[Roles] Delete Role Success', props<{ id: number }>());
export const deleteRoleFailure = createAction('[Roles] Delete Role Failure', props<{ error: string }>());
