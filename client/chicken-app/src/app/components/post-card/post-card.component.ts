import { Component, computed, inject, input, OnInit, Signal, signal } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent implements OnInit {

  dateService = inject(DateService)

  imgPath = input.required<string>()
  createdDate: string = ''
  createdBy: string = ''

  ngOnInit(): void {
    this.createdDate = this.dateService.dateDMY()
    this.createdBy = 'Super User'
  }
}
