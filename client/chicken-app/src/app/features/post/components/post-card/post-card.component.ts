import {
  Component,
  computed,
  inject,
  input, OnInit,
} from '@angular/core';
import { PostService } from '../../service/post.service';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-post-card',
  imports: [
    RouterLink
  ],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent implements OnInit{

  service = inject(PostService)
  #authService = inject(AuthService)

  reqUrl: string = '';
  authenticated = computed(() => this.#authService.authenticated);
  user = this.#authService.username()

  id = input<number>();
  imageId = input<number>(123);
  author = input<string>()

  onDelete(id: number | undefined) {
    if(id) this.service.deleteById(id!).subscribe(() => this.service.posts.reload());
  }
  ngOnInit() {
    this.reqUrl = `${environment.apiUrl}/images/public/${this.imageId()}`
  }
}
