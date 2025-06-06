import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './page-not-found.component.html',
  host: {
    class: 'grow-1 flex flex-col'
  }
})
export class PageNotFoundComponent {
  router = inject(Router)
  route = this.router.url
}
