import { Component } from '@angular/core';
import {PostCardComponent} from '../post-card/post-card.component';

@Component({
  selector: 'app-post-list-placeholder',
  imports: [
    PostCardComponent
  ],
  templateUrl: './post-list-placeholder.component.html'
})
export class PostListPlaceholderComponent {

}
