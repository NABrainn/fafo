import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  days = new Map([
    [1, "poniedziałek"],
    [2, "wtorek"],
    [3, "środa"],
    [4, "czwartek"],
    [5, "piątek"],
    [6, "sobota"],
    [7, "niedziela"],
  ])

  readonly #date = new Date()

  dateDMY() {
    const day = this.#date.getDate();
    const month = this.#date.getMonth() + 1;
    const year = this.#date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  dayOfWeek() {
    return this.days.get(this.#date.getDay()) ?? "poniedziałek"
  }

}
