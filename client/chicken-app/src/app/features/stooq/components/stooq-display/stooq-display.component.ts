import {Component, computed, inject, signal} from '@angular/core';
import {StooqService} from '../../stooq.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-stooq-display',
  imports: [
    NgClass
  ],
  templateUrl: './stooq-display.component.html',
  // host: {
  //   class: 'grow-1 flex flex-col justify-center items-center bg-primary'
  // }
})
export class StooqDisplayComponent {
  stooqService = inject(StooqService)
  quotes = this.stooqService.loadQuotes()
  quotesWithDiff = computed(() => {
    return this.quotes.value()?.map((quote) => ({
      ticker: quote.ticker,
      open: quote.open,
      close: quote.close,
      differential: this.stooqService.differential(quote.open, quote.close, 3),
      symbol: (this.stooqService.differential(quote.open, quote.close, 2) ?? 0) > 0
        ? '↗️'
        : (this.stooqService.differential(quote.open, quote.close, 2) ?? 0) < 0 ? '↘️'
        : (this.stooqService.differential(quote.open, quote.close, 2) ?? 0) === 0 ? ''
        : '',
      positive: (this.stooqService.differential(quote.open, quote.close, 2) ?? 0) > 0
    }));
  });

  toFixed(value: number | undefined, toFixed: number) {
    return this.stooqService.toFixed(value, toFixed)
  }
}
