import { TestBed } from '@angular/core/testing';

import { StooqService } from './stooq.service';

describe('StooqService', () => {
  let service: StooqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StooqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
