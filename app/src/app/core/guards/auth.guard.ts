import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ERole } from '../models/role.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthGuard checking route:', state.url);

    return this.authService.getCurrentUser().pipe(
      tap(user => console.log('Current user:', user)),
      map(user => {
        if (!user) {
          console.log('No user found, redirecting to home');
          this.router.navigate(['/']);
          return false;
        }
        console.log('User authenticated, allowing access');
        return true;
      }),
      catchError(() => {
        // If error occurs, allow navigation
        return of(true);
      })
    );
  }
}
