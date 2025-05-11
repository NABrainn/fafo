import { Component, computed, effect, inject, signal } from '@angular/core';
import { BlogPost, PostService, SelectBlogPost } from '../../service/post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { CommentService, InsertComment, SelectComment } from '../../service/comment.service';
import { httpResource } from '@angular/common/http';

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

  #post = signal<SelectBlogPost | undefined>(undefined);
  post = computed(() => this.#post())

  #comments = signal<SelectComment[]>([]);
  comments = computed(() => this.#comments());

  onCommentSaved(id: number | undefined) {
    if(id)
      this.commentService.findAllCommentsByBlogId(id).subscribe((data) => {
        this.#comments.set(data)
      })    
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if(id)
        this.postService.findById(Number(id)).subscribe((data: SelectBlogPost) => {
          this.#post.set(data) 
          this.#comments.set(data.comments);
        })
    });
  }
}
