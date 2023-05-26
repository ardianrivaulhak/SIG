import { TestBed } from '@angular/core/testing';

import { CustomerAddressService } from './customer-address.service';

describe('CustomerAddressService', () => {
  let service: CustomerAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
