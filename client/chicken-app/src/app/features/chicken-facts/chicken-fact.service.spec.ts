import { TestBed } from '@angular/core/testing';

import { ChickenFactService } from './chicken-fact.service';

describe('ChickenFactService', () => {
  let service: ChickenFactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChickenFactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
