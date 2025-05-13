import {Component, computed, effect, inject, signal} from '@angular/core';
import {StooqService} from '../../stooq.service';
import {NgClass} from '@angular/common';
import {ToFixedPipe} from '../../pipes/to-fixed.pipe';

@Component({
  selector: 'app-stooq-display',
  imports: [
    NgClass,
    ToFixedPipe
  ],
  templateUrl: './stooq-display.component.html',
  // host: {
  //   class: 'grow-1 flex flex-col justify-center items-center bg-primary'
  // }
})
export class StooqDisplayComponent {
  stooqService = inject(StooqService)
  #quotes = this.stooqService.loadQuotes()
  quotes = computed(() => {
    return this.#quotes.value()?.map((quote) => ({
      ...quote,
      symbol: quote.changePositive
        ? '↗️'
        : !quote.changePositive ? '↘️'
        : '',
    }));
  });

}
