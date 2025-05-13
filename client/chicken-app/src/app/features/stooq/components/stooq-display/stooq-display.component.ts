import {Component, inject} from '@angular/core';
import {StooqService} from '../../stooq.service';

@Component({
  selector: 'app-stooq-display',
  imports: [],
  templateUrl: './stooq-display.component.html',
  host: {
    class: 'grow-1 flex flex-col justify-center items-center bg-primary'
  }
})
export class StooqDisplayComponent {
  stooqService = inject(StooqService)

  quotes = this.stooqService.loadQuotes()
}
