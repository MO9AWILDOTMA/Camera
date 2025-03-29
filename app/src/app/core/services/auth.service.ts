import { Injectable } from '@angular/core';
import User from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { ERole } from '../models/role.model';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl + "/auth";
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap((response: any) => {
        if (response && response.user) {
          this.storage.saveData("currentUser", response.user);
          this.redirectBasedOnRole(response.user);
        }
      }),
      catchError(error => {
        // Clear any existing user data on login failure
        this.storage.removeData("currentUser");
        return throwError(error);
      })
    );
  }

  register(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(error => {
        // Handle registration errors
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // Clear user data on logout
        this.storage.removeData("currentUser");
        this.router.navigate(['/']);
      }),
      catchError(error => {
        // Ensure user is logged out even if backend call fails
        this.storage.removeData("currentUser");
        this.router.navigate(['/']);
        return throwError(error);
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    const user = this.storage.getData("currentUser");
    return of(user ? user : null);
  }

  hasRole(requiredRole: ERole): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        if (!user) return false;
        return user.roles?.some((role: { name: ERole }) => role.name === requiredRole) || false;
      })
    );
  }

  hasAnyRole(roles: ERole[]): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        if (!user) return false;
        return user.roles?.some((role: { name: ERole }) => roles.includes(role.name)) || false;
      })
    );
  }

  redirectBasedOnRole(user?: User): void {
    if (!user) {
      user = this.storage.getData("currentUser");
    }

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    const isAdmin = user.roles?.some((role: { name: ERole }) => role.name === ERole.ROLE_ADMIN);

    if (isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/client']);
    }
  }

  // Add this method to debug user roles
  debugUserRoles(): void {
    const user = this.storage.getData("currentUser");
    console.log('Current user:', user);
    if (user && user.roles) {
      console.log('User roles:', user.roles);
      const isAdmin = user.roles.some((role: { name: ERole }) => role.name === ERole.ROLE_ADMIN);
      console.log('Is admin?', isAdmin);
    } else {
      console.log('No roles found for user');
    }
  }
}
