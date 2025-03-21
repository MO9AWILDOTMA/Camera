import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectCurrentUser } from '../store/selectors/auth.selector';
import { ERole } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectCurrentUser).pipe(
      map(user => {
        if (user && user.role.name === ERole.ROLE_ADMIN) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
