import { TestBed } from '@angular/core/testing';

import { MediartucontractService } from './mediartucontract.service';

describe('MediartucontractService', () => {
  let service: MediartucontractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediartucontractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
