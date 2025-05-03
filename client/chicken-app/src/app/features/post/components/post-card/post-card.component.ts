import { Component, computed, inject, input, OnInit, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {

  imgPath = input.required<string>()
  date = signal<string>('');
  author = input<string>('');
}
