import {Component, computed, DestroyRef, effect, inject, signal} from '@angular/core';
import { PostService, SelectBlogPost } from '../../service/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { CommentService, SelectComment } from '../../service/comment.service';
import {environment} from '../../../../../environments/environment';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-page',
  imports: [
    PostCommentComponent
  ],
  templateUrl: './post-page.component.html',
  host: {
    class: 'grow-1 bg-primary'
  }
})
export class PostPageComponent {

  postService = inject(PostService);
  commentService = inject(CommentService)
  route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  #post = signal<SelectBlogPost | undefined>(undefined);
  post = computed(() => this.#post())

  #comments = signal<SelectComment[]>([]);
  comments = computed(() => this.#comments());
  reqUrl = computed(() => {
    const imageId = this.post()?.imageId;
    return imageId ? `${environment.apiUrl}/images/public/${imageId}` : '';
  });

  onCommentStateChange() {
      const postId = this.post()?.id;
      if (postId) {
        this.commentService.findAllCommentsByBlogId(postId)?.subscribe((data) => {
          this.#comments.set(data)
        });
      }
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      const id = params.get('id');
      if(id)
        this.postService.findById(Number(id)).subscribe((data: SelectBlogPost) => {
          this.#post.set(data)
          this.#comments.set(data.comments);
        })
    });
  }
}
