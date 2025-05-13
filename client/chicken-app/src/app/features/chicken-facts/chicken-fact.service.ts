import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import type {Fact} from '../../../../../../server/src/controller/external/chickenFacts/chickenApiModel';

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

  loadFacts() {
    return this.#facts
  }
}
