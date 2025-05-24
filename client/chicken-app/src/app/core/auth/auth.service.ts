import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment';
import {catchError, map, of, tap, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { LoginData } from './components/login-form/login-form.component';
import { RegisterData } from './components/register-form/register-form.component';
import {ServiceState} from '../../shared/service-state';

interface AuthState extends ServiceState {
  username: string | undefined,
  csrfToken: string,
  authenticated: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  state = signal<AuthState>({
    isLoading: false,
    error: false,
    message: '',
    username: '',
    csrfToken: '',
    authenticated: false
  })

  register(user: RegisterData) {
    return this.#http.post(`${environment.authUrl}/register`, user).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error)
      }),
    )
  }

  login(user: LoginData) {
    return this.#http.post(`${environment.authUrl}/login`, user, {withCredentials: true}).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error)
      }),
    );
  }

  #verify() {
    return this.#http.post(`${environment.authUrl}/verify`, {}, {withCredentials: true}).pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error)
      }),
    )
  }

  verifyAuthenticated() {
    return this.#verify();
  }

  verifyToken() {
    return this.#verify().pipe(
      tap((verified: boolean) => {
        if(!verified) {
          this.logout().subscribe({
            next: () => {
              this.state.update((prev) => ({
                ...prev,
                isLoading: false,
                error: true,
                message: 'Nieprawidłowy token',
                authenticated: true,
                username: undefined,
                csrfToken: ''
              }))
              this.#router.navigate(["/logowanie"]);
            },
            error: () => {
              this.state.update((prev) => ({
                ...prev,
                isLoading: false,
                error: true,
                message: 'Nieprawidłowy token',
                authenticated: true,
                username: undefined,
                csrfToken: ''
              }))
              this.#router.navigate(["/logowanie"]);
            }
          });
        }
      })
    );
  }

  logout() {
    return this.#http.post(`${environment.authUrl}/logout`, {}, {withCredentials: true}).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error)
      }),
    )
  }

  navigateHome() {
    this.#router.navigate(['/']);
  }

  navigateLogin() {
    this.#router.navigate(['/logowanie']);
  }

  clearMessage() {
    this.state.update((prev) => ({
      ...prev,
      message: ''
    }))
  }

  get authenticated() {
    return computed(() => this.state().authenticated)();
  }

  get message() {
    return computed(() => this.state().message)();
  }

  get user() {
    return computed(() => this.state().username)();
  }

  set user(username: string | undefined) {
    this.state.update((prev) => ({
      ...prev,
      username: username
    }))
  }

  get csrfToken() {
    return computed(() => this.state().csrfToken)()
  }
}
