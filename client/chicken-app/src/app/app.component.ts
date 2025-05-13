import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import {StooqService} from './features/stooq/stooq.service';
import {KeyValuePipe} from '@angular/common';
import {httpResource} from '@angular/common/http';
import {ChickenFactService, Result} from './features/chicken-facts/chicken-fact.service';

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
  }
}
