import { Component, inject } from '@angular/core';
import { PostService } from '../../post.service';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  imports: [
    PostCardComponent
  ],
  templateUrl: './post-list.component.html'
})
export class PostListComponent {
  service = inject(PostService)
  posts = this.service.findAll()
}
