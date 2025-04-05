import { Component, inject } from '@angular/core';
import { PostCardComponent } from '../../../app/components/post-card/post-card.component';
import { PostService } from '../post.service';

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
