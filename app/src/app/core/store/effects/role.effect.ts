import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as RoleActions from '../actions/role.action';
import { RoleService } from '../../services/role.service';

@Injectable()
export class RoleEffects {
  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.loadRoles),
      mergeMap(() =>
        this.roleService.getRoles().pipe(
          map((roles) => RoleActions.loadRolesSuccess({ roles })),
          catchError((error) =>
            of(RoleActions.loadRolesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.addRole),
      mergeMap(({ role }) =>
        this.roleService.createRole(role).pipe(
          map((newRole) => RoleActions.addRoleSuccess({ role: newRole })),
          catchError((error) =>
            of(RoleActions.addRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.updateRole),
      mergeMap(({ id, role }) =>
        this.roleService.updateRole(id, role).pipe(
          map((updatedRole) =>
            RoleActions.updateRoleSuccess({ role: updatedRole })
          ),
          catchError((error) =>
            of(RoleActions.updateRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.deleteRole),
      mergeMap(({ id }) =>
        this.roleService.deleteRole(id).pipe(
          map(() => RoleActions.deleteRoleSuccess({ id })),
          catchError((error) =>
            of(RoleActions.deleteRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private roleService: RoleService
  ) {}
}
