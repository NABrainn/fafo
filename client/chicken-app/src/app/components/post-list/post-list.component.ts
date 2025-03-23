import { Component } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  imports: [
    PostCardComponent
  ],
  templateUrl: './post-list.component.html'
})
export class PostListComponent {

}
