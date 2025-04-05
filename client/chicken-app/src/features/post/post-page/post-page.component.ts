import { Component, effect, inject, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { PostListComponent } from '../../../app/components/post-list/post-list.component';

@Component({
  selector: 'app-post-page',
  imports: [
    PostListComponent
  ],
  templateUrl: './post-page.component.html'
})
export class PostPageComponent {
  service = inject(PostService)
  posts = this.service.findAll()
}
