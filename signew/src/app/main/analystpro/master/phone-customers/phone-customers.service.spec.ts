import { TestBed } from '@angular/core/testing';

import { PhoneCustomersService } from './phone-customers.service';

describe('PhoneCustomersService', () => {
  let service: PhoneCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
