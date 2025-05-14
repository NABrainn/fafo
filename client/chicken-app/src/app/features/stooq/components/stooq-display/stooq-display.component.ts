import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
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
  host: {
    class: 'grow-1 max-w-100 mx-auto'
  }
})
export class StooqDisplayComponent implements  OnInit{
  stooqService = inject(StooqService)
  quotes = this.stooqService.loadQuotes()
  quotesDisplay = computed(() => {
    return this.quotes.value()?.map((quote) => ({
      ...quote,
      symbol: quote.changePositive
        ? '↗️'
        : !quote.changePositive ? '↘️'
        : '',
    }));
  });
  ngOnInit() {
    setInterval(() => this.quotes.reload(), 1000 * 60 * 60)
  }
}
