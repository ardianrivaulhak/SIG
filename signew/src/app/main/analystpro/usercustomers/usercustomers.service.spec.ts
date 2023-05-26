import { TestBed } from '@angular/core/testing';

import { UsercustomersService } from './usercustomers.service';

describe('UsercustomersService', () => {
  let service: UsercustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsercustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
