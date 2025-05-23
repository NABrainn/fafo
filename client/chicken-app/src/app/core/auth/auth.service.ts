import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginData } from './components/login-form/login-form.component';
import { RegisterData } from './components/register-form/register-form.component';

export type AuthUser = {
  username: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  #authenticated = signal<boolean>(false)
  #message = signal<string>('');
  #user = signal<AuthUser | undefined>(undefined);
  #csrfToken = signal<string>('');

  register(user: RegisterData) {
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

  login(user: LoginData) {
    return this.#http.post(`${environment.authUrl}/login`, user, {withCredentials: true}).pipe(
      tap((res: any) => {
        this.authenticated.set(true);
        this.#user.set({username: user.username})
        this.navigateHome()
      }),
      catchError((err: HttpErrorResponse) => {
        this.authenticated.set(false);
        this.#message.set(err.error);
        throw new Error(err.error);
      })
    );
  }

  #verify() {
    return this.#http.post(`${environment.authUrl}/verify`, {}, {withCredentials: true}).pipe(
      map(() => true),
      tap((data: any) => {
        this.#user.set({username: data})
        this.authenticated.set(true);
      }),
      catchError((err: HttpErrorResponse) => {
        this.authenticated.set(false);
        return of(false);
      })
    )
  }

  verifyAuthenticated() {
    return this.#verify();
  }

  verifyToken() {
    return this.#verify().pipe(
      tap((verified: boolean) => {
        if(!verified) {
          this.logout().subscribe();
        }
      })
    );
  }

  logout() {
    return this.#http.post(`${environment.authUrl}/logout`, {}, {withCredentials: true}).pipe(
      tap((res: any) => {
        this.#user.set(undefined);
        this.authenticated.set(false);
        this.#router.navigate(['logowanie']);
      })
    )
  }

  navigateHome() {
    this.#router.navigate(['/']);
  }

  clearMessage() {
    this.#message.set('');
  }

  get authenticated() {
    return this.#authenticated;
  }

  get message() {
    return this.#message;
  }

  get user() {
    return computed(() => this.#user());
  }

  get csrfToken() {
    return computed(() => this.#csrfToken())
  }
}
