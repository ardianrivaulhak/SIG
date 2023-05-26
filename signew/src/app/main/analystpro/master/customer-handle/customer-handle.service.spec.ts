import { TestBed } from '@angular/core/testing';

import { CustomerHandleService } from './customer-handle.service';

describe('CustomerHandleService', () => {
  let service: CustomerHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
