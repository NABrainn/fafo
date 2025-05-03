import { Component, computed, inject, input, OnInit, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent implements OnInit {

  imgPath = input.required<string>()
  createdDate: string = ''
  createdBy: string = ''

  ngOnInit(): void {
    this.createdBy = 'Super User'
  }
}
