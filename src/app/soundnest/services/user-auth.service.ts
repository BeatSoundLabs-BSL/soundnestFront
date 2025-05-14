import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../model/user.entity';
import { BaseService } from '../../shared/services/base.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<User> {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    super();
    this.resourceEndpoint = '/users'; // Set the endpoint for user resources

    // Initialize the behavior subject with stored user (if any)
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Authenticates a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Observable of authenticated User or error
   */
  login(email: string, password: string): Observable<User> {
    const loginData = { email, password };
    const loginUrl = `${this.serverBaseUrl}/auth/login`;

    return this.http.post<{ user: User, token: string }>(loginUrl, JSON.stringify(loginData), this.httpOptions)
      .pipe(
        map(response => {
          // Store token in local storage or a token service if needed
          if (response.token) {
            localStorage.setItem('authToken', response.token);

            // Update HTTP headers with the new token for future requests
            this.httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${response.token}`
              })
            };
          }
          return response.user;
        }),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          return throwError(() => new Error('Authentication failed: ' + (error.error?.message || 'Invalid credentials')));
        })
      );
  }

  /**
   * Registers a new user
   * @param user User data for registration
   * @returns Observable of the registered User
   */
  register(user: User): Observable<User> {
    const registerUrl = `${this.serverBaseUrl}/auth/register`;

    return this.http.post<User>(registerUrl, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap(createdUser => {
          // Optionally auto-login after registration
          // this.currentUserSubject.next(createdUser);
          // localStorage.setItem('currentUser', JSON.stringify(createdUser));
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    // Optional: Call logout endpoint to invalidate token on server
    // this.http.post(`${this.serverBaseUrl}/auth/logout`, {}, this.httpOptions).subscribe();

    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);

    // Reset HTTP headers to default (no auth token)
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  /**
   * Updates the current user's profile
   * @param userData Updated user data
   * @returns Observable of the updated User
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    if (!this.currentUserValue?.id) {
      return throwError(() => new Error('No authenticated user'));
    }

    return this.update(this.currentUserValue.id, { ...this.currentUserValue, ...userData })
      .pipe(
        tap(updatedUser => {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  /**
   * Check if current user has owner privileges
   * @returns boolean indicating if user is an owner
   */
  isOwner(): boolean {
    return this.currentUserValue?.isOwner || false;
  }

  /**
   * Refreshes the authentication token
   * @returns Observable of the refresh result
   */
  refreshToken(): Observable<string> {
    const refreshUrl = `${this.serverBaseUrl}/auth/refresh`;
    const token = localStorage.getItem('authToken');

    if (!token) {
      return throwError(() => new Error('No token available to refresh'));
    }

    return this.http.post<{ token: string }>(refreshUrl, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      map(response => {
        const newToken = response.token;
        localStorage.setItem('authToken', newToken);

        // Update HTTP headers with the new token
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          })
        };

        return newToken;
      }),
      catchError(this.handleError)
    );
  }
}
