import {
  AfterContentInit,
  Component,
  computed,
  contentChild,
  ContentChild,
  effect,
  inject, Input,
  input,
  OnInit,
  output,
  Signal,
  signal,
  TemplateRef
} from '@angular/core';
import { PostService } from '../../service/post.service';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';



@Component({
  selector: 'app-post-card',
  imports: [
    RouterLink
  ],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {

  service = inject(PostService)
  #authService = inject(AuthService)

  authenticated = computed(() => this.#authService.authenticated());
  loggedUser = this.#authService.user
  imgPath = input.required<string>();
  id = input.required<number>();
  author = input<string>()

  onDelete(id: number | undefined) {
    if(id) this.service.deleteById(id!).subscribe(() => this.service.loadPosts().reload());
  }
}
