import {Component, computed, inject, OnInit} from '@angular/core';
import {StooqService} from '../../stooq.service';
import {NgClass} from '@angular/common';
import {ToFixedPipe} from '../../pipes/to-fixed.pipe';
import {StooqDisplayPlaceholderComponent} from '../stooq-display-placeholder/stooq-display-placeholder.component';

@Component({
  selector: 'app-stooq-display',
  imports: [
    NgClass,
    ToFixedPipe,
    StooqDisplayPlaceholderComponent,
  ],
  templateUrl: './stooq-display.component.html',

})
export class StooqDisplayComponent implements  OnInit{
  stooqService = inject(StooqService)
  quotes = this.stooqService.loadQuotes()
  quotesComputed = computed(() => {
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
