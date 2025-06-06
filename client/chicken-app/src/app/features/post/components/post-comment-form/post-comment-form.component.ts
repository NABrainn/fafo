import {Component, inject, input, model, output} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommentService, InsertComment} from '../../service/comment.service';
import {AuthService} from '../../../../core/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-post-comment-form',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './post-comment-form.component.html'
})
export class PostCommentFormComponent {

  #commentService = inject(CommentService)
  #authService = inject(AuthService)

  fb = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(50)]]
  })

  authenticated = this.#authService.authenticated()
  readonly = model<boolean>()
  blogPostId = input<number>();
  commentId = input<number>();
  commentStateChange = output<number>()

  saveComment(event: Event) {
    event.preventDefault()
    this.#commentService.addComment({
      content: this.form.controls.content.value,
      blogPostId: this.blogPostId()
    } as InsertComment).subscribe({
      next: (data) => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: false,
          message: ''
        }))
        this.form.reset()
        this.commentStateChange.emit(this.commentId()!)
      },
      error: (err: HttpErrorResponse) => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: true,
          message: 'Błąd podczas dodawania komentarza'
        }))
      }
    })
  }
}
