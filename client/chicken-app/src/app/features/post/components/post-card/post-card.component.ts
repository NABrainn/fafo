import { AfterContentInit, Component, computed, contentChild, ContentChild, effect, inject, input, OnInit, Signal, signal, TemplateRef } from '@angular/core';
import { PostService } from '../../service/post.service';
import {RouterLink} from '@angular/router';

export type Author = {
  username: string,
  verified: boolean
}

@Component({
  selector: 'app-post-card',
  imports: [
    RouterLink
  ],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {

  service = inject(PostService)

  imgPath = input.required<string>();
  id = input.required<number>();
}
