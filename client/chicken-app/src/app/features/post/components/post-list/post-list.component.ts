import { Component, inject } from '@angular/core';
import { PostService } from '../../service/post.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
export class PostListComponent {
  service = inject(PostService)
  posts = this.service.loadPosts()
}
