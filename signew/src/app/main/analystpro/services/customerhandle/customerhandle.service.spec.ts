import { TestBed } from '@angular/core/testing';

import { CustomerhandleService } from './customerhandle.service';

describe('CustomerhandleService', () => {
  let service: CustomerhandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerhandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
