import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ERole } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUser().pipe(
      map(user => {
        // Check if user exists
        if (!user) {
          console.log('No user found, redirecting to auth');
          this.router.navigate(['/auth']);
          return false;
        }

        // Check if the user has admin role
        const isAdmin = user.roles?.some(role => role.name === ERole.ROLE_ADMIN);

        if (isAdmin) {
          console.log('Admin role verified, allowing access');
          return true;
        } else {
          console.log('Not an admin, redirecting to client area');
          this.router.navigate(['/client']);
          return false;
        }
      })
    );
  }
}
