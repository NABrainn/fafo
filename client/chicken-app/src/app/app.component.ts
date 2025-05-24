import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import {ChickenFactsComponent} from './features/chicken-facts/components/chicken-facts/chicken-facts.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ChickenFactsComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  get authenticated() {
    return this.authService.authenticated;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.state.update((prev) => ({
          ...prev,
          authenticated: false,
          username: undefined,
          error: false,
          message: ''
        }))
        this.authService.navigateLogin()

      },
      error: () => {
        this.authService.state.update((prev) => ({
          ...prev,
          authenticated: false,
          username: undefined,
          error: true,
          message: 'Błąd podczas wylogowywania'
        }));
        this.authService.navigateLogin()
      }
    });
  }

  ngOnInit(): void {
    this.authService.verifyAuthenticated().subscribe({
      next: (verified: boolean) => {
        this.authService.state.update((prev) => ({
          ...prev,
          authenticated: verified,
          username: this.authService.username(),
          error: false,
          message: ''
        }))
      },
      error: (err: HttpErrorResponse) => {
        this.authService.state.update((prev) => ({
          ...prev,
          authenticated: false,
          username: undefined,
          error: true,
          message: err.error
        }))
      }
    });
  }
}
