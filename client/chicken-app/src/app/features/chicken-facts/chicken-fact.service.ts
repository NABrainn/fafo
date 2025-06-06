import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import type {Fact} from '../../../../../../server/src/controller/external/chickenFacts/chickenModel';

export type Result = {
  fact?: Fact;
  count?: number;
  last_counted?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChickenFactService {

  PUBLIC_URL = `${environment.apiUrl}/chicken/public/facts`
  #facts = httpResource<Result>(() => this.PUBLIC_URL)

  get facts() {
    return this.#facts
  }
}
