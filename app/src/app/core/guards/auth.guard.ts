import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, of } from 'rxjs';
import { selectUser } from '../store/selectors/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // return this.store.select(selectUser).pipe(
    //   map(user => {
    //     if (user) {
    //       return true;
    //     }
    //     this.router.navigate(['/login']);
    //     return false;
    //   })
    // );
    return of(true)
  }
}
