import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
// import { selectToken } from '../store/selectors/auth.selector';
import { logout } from '../store/actions/auth.action';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.store.select(selectToken).pipe(
  //     map(token => {
  //       if (token) {
  //         request = request.clone({
  //           setHeaders: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //       }
  //       return next.handle(request).pipe(
  //         catchError((error: HttpErrorResponse) => {
  //           if (error.status === 401) {
  //             this.store.dispatch(logout());
  //           }
  //           return throwError(() => error);
  //         })
  //       );
  //     })
  //   );

  return new Observable
}
}
