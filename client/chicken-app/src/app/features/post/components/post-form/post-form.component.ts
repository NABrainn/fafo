import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './post-form.component.html',
  host: {
    class: 'fixed inset-0 flex items-center justify-center z-50 bg-black/50',
    '(click)': 'closeModal($event)',
  }
})
export class PostFormComponent {

  router = inject(Router);
  fb = inject(FormBuilder);
  service = inject(PostService);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    subtitle: ['', Validators.maxLength(100)],
    content: ['', [Validators.required, Validators.maxLength(500)]]
  });

  closeModal(event: Event) {
    event.stopPropagation();
    this.router.navigate(['posty'])
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.service.save({
      title: this.form.controls.title.value,
      subtitle: this.form.controls.subtitle.value,
      content: this.form.controls.content.value,
      imgUrl: 'https://via.placeholder.com/150'
    }).subscribe(() => {
      this.closeModal(event);
      this.service.reload();
    })
  }
}
