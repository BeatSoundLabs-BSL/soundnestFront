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

  login(email: string, password: string): Observable<User> {
    const loginData = { email, password };

    const loginUrl = `${this.serverBaseUrl}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    return this.http.get<User[]>(loginUrl, this.httpOptions)
      .pipe(
        map(users => {
          if (users && users.length > 0) {
            const user = users[0];

            const token = 'simulated-jwt-token-' + Date.now();
            localStorage.setItem('authToken', token);

            this.httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              })
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            return user;
          } else {
            throw new Error('Invalid email or password');
          }
        }),
        catchError(error => {
          return throwError(() => new Error('Authentication failed: ' + (error.error?.message || 'Invalid credentials')));
        })
      );
  }

  register(user: User): Observable<User> {
    const registerUrl = `${this.serverBaseUrl}/users`;

    return this.http.post<User>(registerUrl, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap(createdUser => {

        }),
        catchError(this.handleError)
      );
  }

  logout(): void {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);

    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

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

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isOwner(): boolean {
    return this.currentUserValue?.isOwner || false;
  }

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
