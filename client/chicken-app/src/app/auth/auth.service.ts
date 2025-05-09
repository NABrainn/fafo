import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NewUser } from './components/register-form/register-form.component';
import { User } from './components/login-form/login-form.component';
import { environment } from '../../environments/environment.development';
import { catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  authenticated = signal<boolean>(false)
  #message = signal<string>('');

  register(user: NewUser) {
    return this.#http.post(`${environment.authUrl}/register`, user).pipe(
      tap((res: any) => {
        this.#router.navigate(['/logowanie']);
      }),
      catchError((err: HttpErrorResponse) => {
        this.#message.set(err.error);
        throw new Error(err.error);
      })
    )
  }

  login(user: User) {
    return this.#http.post(`${environment.authUrl}/login`, user).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.authenticated.set(true);
          this.#message.set('Zalogowano pomyślnie');
          this.navigateHome()
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.authenticated.set(false);
        this.#message.set(err.error);
        throw new Error(err.error);
      })
    );
  }

  verify() {
    return this.#http.post(`${environment.authUrl}/verify`, {}).pipe(
      map(() => true),
      tap((authenticated: boolean) => {
        if (authenticated) {
          this.authenticated.set(authenticated);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.authenticated.set(false);
        this.#router.navigate(['logowanie']);
        return of(false);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticated.set(false);
    this.#router.navigate(['logowanie']);
  }

  navigateHome() {
    this.#router.navigate(['/']);
  }

  clearMessage() {
    this.#message.set('');
  }

  get message() {
    return this.#message;
  }
}
