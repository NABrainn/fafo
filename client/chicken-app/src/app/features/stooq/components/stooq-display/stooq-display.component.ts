import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {StooqService} from '../../stooq.service';
import {NgClass} from '@angular/common';
import {ToFixedPipe} from '../../pipes/to-fixed.pipe';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-stooq-display',
  imports: [
    NgClass,
    ToFixedPipe,
    LoadingSpinnerComponent
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
