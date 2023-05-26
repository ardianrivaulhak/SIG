import { TestBed } from '@angular/core/testing';

import { ComplainQcService } from './complain-qc.service';

describe('ComplainQcService', () => {
  let service: ComplainQcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplainQcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
