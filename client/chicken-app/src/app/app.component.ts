import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import {ChickenFactService} from './features/chicken-facts/chicken-fact.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  factService = inject(ChickenFactService)

  facts = this.factService.loadFacts()

  get authenticated() {
    return this.authService.authenticated();
  }

  logout() {
    this.authService.logout();
  }


  ngOnInit(): void {
    this.authService.verifyAuthenticated().subscribe()
    setInterval(() => this.facts.reload(), 10000)
  }
}
