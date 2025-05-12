import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  get authenticated() {
    return this.authService.authenticated();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.verifyAuthenticated().subscribe()
  }
}
