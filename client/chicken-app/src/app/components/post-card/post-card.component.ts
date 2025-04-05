import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent implements OnInit {
  dateService = inject(DateService)
  createdDate: string = ''

  ngOnInit(): void {
    this.createdDate = this.dateService.dateDMY()
  }
}
