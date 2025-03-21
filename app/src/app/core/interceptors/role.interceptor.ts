import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../store/selectors/auth.selector';
import { ERole } from '../models/role.model';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectCurrentUser).pipe(
      map(user => {
        if (!user) {
          return next.handle(request);
        }

        // Add role-based headers
        const roleHeader = this.getRoleHeader(user.role.name);
        if (roleHeader) {
          request = request.clone({
            setHeaders: {
              'X-User-Role': roleHeader
            }
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
              // Handle forbidden access based on role
              this.handleForbiddenAccess(user.role.name);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  private getRoleHeader(role: ERole): string {
    switch (role) {
      case ERole.ROLE_ADMIN:
        return 'admin';
      case ERole.ROLE_MODERATOR:
        return 'moderator';
      case ERole.ROLE_CINEPHILE:
        return 'cinephile';
      default:
        return '';
    }
  }

  private handleForbiddenAccess(role: ERole): void {
    // Handle forbidden access based on role
    // You can implement custom logic here, such as showing a specific error message
    // or redirecting to a different page
    console.error(`Access forbidden for role: ${role}`);
  }
}
