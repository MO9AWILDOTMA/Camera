import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ERole } from '../models/role.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        // If no user, redirect to home
        if (!user) {
          this.router.navigate(['/auth']);
          return false;
        }

        // Check if user is admin
        const isAdmin = user.roles?.some((role: { name: ERole }) => role.name === ERole.ROLE_ADMIN);

        if (isAdmin) {
          // If admin, redirect to admin dashboard
          this.router.navigate(['/admin']);
          return false;
        }

        return true;
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
