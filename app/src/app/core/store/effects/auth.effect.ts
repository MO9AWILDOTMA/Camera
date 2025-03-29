import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.action';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials.email, credentials.password).pipe(
          tap((response: any) => {
            // Save user data to localStorage
            localStorage.setItem('currentUser', JSON.stringify(response));
          }),
          map((response: any) =>
            AuthActions.loginSuccess({
              user: response,
            })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          tap(() => {
            // Remove user data from localStorage
            localStorage.removeItem('currentUser');
          }),
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.logoutFailure({ error: error.error?.message || 'Logout failed' }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ user }) =>
        this.authService.register(user).pipe(
          map((response:any) =>
            AuthActions.registerSuccess({
              user: response,
            })
          ),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.error?.message || 'Register failed' }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
