import {
  Component,
  computed,
  inject,
  input, OnInit,
} from '@angular/core';
import { PostService } from '../../service/post.service';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';
import {ImageService} from '../../service/image.service';
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
  authenticated = computed(() => this.#authService.authenticated());
  loggedUser = this.#authService.user

  id = input.required<number>();
  imageId = input<number>();
  author = input<string>()

  onDelete(id: number | undefined) {
    if(id) this.service.deleteById(id!).subscribe(() => this.service.loadPosts().reload());
  }
  ngOnInit() {
    this.reqUrl = `${environment.apiUrl}/images/public/${this.imageId()}`
  }
}
