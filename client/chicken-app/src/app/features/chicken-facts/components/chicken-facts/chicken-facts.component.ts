import {Component, inject, input, OnInit} from '@angular/core';
import {ChickenFactService} from '../../chicken-fact.service';

@Component({
  selector: 'app-chicken-facts',
  imports: [],
  templateUrl: './chicken-facts.component.html'
})
export class ChickenFactsComponent implements OnInit{
  factService = inject(ChickenFactService)

  interval = input<number>(10000)
  facts = this.factService.loadFacts()

  ngOnInit() {
    setInterval(() => this.facts.reload(), this.interval())
  }
}
