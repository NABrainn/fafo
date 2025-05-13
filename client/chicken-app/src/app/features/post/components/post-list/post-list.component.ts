import {Component, inject, OnInit} from '@angular/core';
import { PostService } from '../../service/post.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-post-list',
  imports: [
    PostCardComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './post-list.component.html',
  host: {
    class: 'grow-1 flex flex-col'
  }
})
export class PostListComponent implements OnInit{
  service = inject(PostService)
  #authService = inject(AuthService)
  posts = this.service.loadPosts()

  ngOnInit() {
    this.#authService.verifyAuthenticated().subscribe()
  }
}
