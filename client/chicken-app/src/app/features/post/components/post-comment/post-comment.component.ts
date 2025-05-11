import { Component, inject, input, output, signal } from '@angular/core';
import { CommentService, InsertComment } from '../../service/comment.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-post-comment',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './post-comment.component.html'
})
export class PostCommentComponent {
  
  commentService = inject(CommentService)
  #authService = inject(AuthService)

  authenticated = this.#authService.authenticated
  commentSaved = output<number | undefined>()

  fb = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(50)]]
  })
  readonly = input<boolean>()
  content = input<string>()
  blogPostId = input<number>();

  saveComment(event: Event) {
    event.preventDefault()
    this.commentService.save({
      content: this.form.controls.content.value,
      blogPostId: this.blogPostId()
    } as InsertComment).subscribe((data) => {
      this.form.reset()
      this.commentSaved.emit(data.blogPostId)
    })    
  }

  ngOnInit() {
    this.form.controls.content.setValue(this.content()!)
    this.#authService.isAuthenticated()
    
  }
}
