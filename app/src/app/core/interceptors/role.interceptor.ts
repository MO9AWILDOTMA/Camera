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
import { selectUser } from '../store/selectors/auth.selector';
import Role, { ERole } from '../models/role.model';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return this.store.select(selectUser).pipe(
    //   map(user => {
    //     if (!user) {
    //       return next.handle(request);
    //     }

    //     // Add role-based headers
    //     const roleHeader = this.getRoleHeader(user.roles);
    //     if (roleHeader) {
    //       request = request.clone({
    //         setHeaders: {
    //           'X-User-Role': roleHeader
    //         }
    //       });
    //     }

    //     return next.handle(request).pipe(
    //       catchError((error: HttpErrorResponse) => {
    //         if (error.status === 403) {
    //           // Handle forbidden access based on role
    //           this.handleForbiddenAccess(user.roles);
    //         }
    //         return throwError(() => error);
    //       })
    //     );
    //   })
    // );

    return new Observable
  }

  private getRoleHeader(roles: Role[]): string {
    let checker = "";
    roles.forEach(role => {
      switch (role.name) {
        case ERole.ROLE_ADMIN:
          checker = 'admin'
          return ;
        case ERole.ROLE_MODERATOR:
          checker = 'moderator'
          return ;
        case ERole.ROLE_CINEPHILE:
          checker = 'cinephile'
          return ;
        default:
          return ;
      }
    })
    return checker
  }

  private handleForbiddenAccess(roles: Role[]): void {
    // Handle forbidden access based on role
    // You can implement custom logic here, such as showing a specific error message
    // or redirecting to a different page
    console.error(`Access forbidden for role: ${roles}`);
  }
}
