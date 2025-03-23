import { Component, computed, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {
  readonly #createdDate = signal<Date>(new Date());
  readonly createdDateDMY: Signal<string> = computed(() => {
    const day = this.#createdDate().getDate();
    const month = this.#createdDate().getMonth() + 1;
    const year = this.#createdDate().getFullYear();
    return `${day}.${month}.${year}`;
  });
}
