import { NgClass } from '@angular/common';
import {Component, computed, inject, input, signal} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../service/post.service';
import {ImageService} from '../../service/image.service';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './post-form.component.html',
  host: {
    class: 'grow-1 bg-primary flex flex-col',
  }
})
export class PostFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  service = inject(PostService);
  imageService = inject(ImageService)

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(80), Validators.maxLength(100)]],
    subtitle: ['', [Validators.minLength(120), Validators.maxLength(150)]],
    content: ['', [Validators.required, Validators.minLength(750), Validators.maxLength(1000)]],
  });

  imageName = signal<string | undefined>('')

  #imageId = signal<number>(0)
  imageId = computed(() => this.#imageId())

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
      imageId: this.imageId()
    }).subscribe(() => {
      this.closeModal(event);
      this.service.posts.reload()
    })
  }
}
