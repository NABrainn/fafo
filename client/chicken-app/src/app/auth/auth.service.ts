import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NewUser } from './components/register-form/register-form.component';
import { User } from './components/login-form/login-form.component';
import { environment } from '../../environments/environment.development';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  authenticated = signal<boolean>(false)
  message = signal<string>('');

  register(user: NewUser) {
    return this.#http.post(`${environment.authUrl}/register`, user).pipe(
      tap((res: any) => {
        this.#router.navigate(['/login']);
      }),
      catchError((err: HttpErrorResponse) => {
        console.log(err);

        this.message.set(err.error);
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
          this.message.set('Zalogowano pomyślnie');
          this.navigateHome()
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        
        this.authenticated.set(false);
        this.message.set(err.error);
        throw new Error(err.error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticated.set(false);
    this.#router.navigate(['logowanie']);
  }

  navigateHome() {
    this.#router.navigate(['/']);
  }
}
