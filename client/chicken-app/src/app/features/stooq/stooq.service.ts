import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';

export type Quote  = {
  name: string,
  ticker: string,
  date: string,
  time: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  change: number,
  changePositive: boolean
}

@Injectable({
  providedIn: 'root'
})
export class StooqService {

  PUBLIC_URL = `${environment.apiUrl}/stooqapi/public`
  #quotes = httpResource<Quote[]>(() => `${this.PUBLIC_URL}/quotes`)

  loadQuotes() {
    return this.#quotes
  }
}
