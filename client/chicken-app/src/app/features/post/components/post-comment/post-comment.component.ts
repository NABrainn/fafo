import {Component, computed, effect, inject, input, model, output, signal} from '@angular/core';
import { CommentService, InsertComment } from '../../service/comment.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';

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

  loggedUser = computed(() => this.#authService.user()?.username)
  authenticated = computed(() => this.#authService.authenticated())
  commentStateChange = output<number>()

  fb = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(50)]]
  })

  createMode = input<boolean>()
  author = model<string>();
  readonly = model<boolean>()
  content = input<string>()
  blogPostId = input<number>();
  commentId = input<number>();

  commentEffect = effect(() => {
    if (this.readonly() && this.content()) {
      this.form.controls.content.setValue(this.content()!);
    }
  });

  saveComment(event: Event) {
    event.preventDefault()
    this.#commentService.addComment({
      content: this.form.controls.content.value,
      blogPostId: this.blogPostId()
    } as InsertComment).subscribe((data) => {
      this.form.reset()
      this.commentStateChange.emit(this.commentId()!)
    })
  }

  onUpdate() {
    this.#toggleReadonly()
  }

  onUpdateCommit() {
    this.#toggleReadonly()
    this.#commentService.updateComment({
      id: this.commentId(),
      content: this.form.controls.content.value,
      blogPostId: this.blogPostId()
    } as InsertComment).subscribe(() => {
      this.commentStateChange.emit(this.commentId()!)
    })
  }

  #toggleReadonly() {
    this.readonly.update((prev) => !prev)
  }

  onDelete() {
    this.#commentService.delete(this.commentId()).subscribe(() => {
      this.commentStateChange.emit(this.commentId()!)
    })
  }

  ngOnInit() {
    this.form.controls.content.setValue(this.content()!)
  }
}
