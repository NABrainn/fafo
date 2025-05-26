import {Component, computed, effect, inject, input, model, output, signal} from '@angular/core';
import { CommentService, InsertComment } from '../../service/comment.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-post-comment',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './post-comment.component.html'
})
export class PostCommentComponent {

  #commentService = inject(CommentService)
  #authService = inject(AuthService)

  user = this.#authService.username
  authenticated = this.#authService.authenticated
  commentStateChange = output<number>()

  fb = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(50)]]
  })

  author = model<string>();
  // readonly = model<boolean>();
  readonly = signal(true)
  canMutate = computed(() => this.user() === this.author() && this.authenticated() && !this.readonly())
  content = input<string>()
  blogPostId = input<number>();
  commentId = input<number>();

  commentEffect = effect(() => {
    if (this.content()) {
      this.form.controls.content.setValue(this.content()!);
    }
  });

  onUpdate() {
    this.#toggleReadonly()
  }

  onUpdateCommit() {
    this.#toggleReadonly()
    this.#commentService.updateComment({
      id: this.commentId(),
      content: this.form.controls.content.value,
      blogPostId: this.blogPostId()
    } as InsertComment).subscribe({
      next: () => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: false,
          message: ''
        }))
        this.commentStateChange.emit(this.commentId()!)
      },
      error: (err: HttpErrorResponse) => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: true,
          message: 'Błąd podczas edycji komentarza'
        }))
      }
    })
  }

  #toggleReadonly() {
    this.readonly.update((prev) => !prev)
  }

  onDelete() {
    this.#commentService.delete(this.commentId()).subscribe({
      next: () => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: false,
          message: ''
        }))
        this.#toggleReadonly()
        this.commentStateChange.emit(this.commentId()!)
      },
      error: (err: HttpErrorResponse) => {
        this.#commentService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: true,
          message: 'Błąd podczas usuwania komentarza'
        }))
      }
    })
  }

  ngOnInit() {
    this.form.controls.content.setValue(this.content()!)
  }
}
