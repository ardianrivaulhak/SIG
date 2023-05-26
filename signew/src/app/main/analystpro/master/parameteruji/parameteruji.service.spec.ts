import { TestBed } from '@angular/core/testing';

import { ParameterujiService } from './parameteruji.service';

describe('ParameterujiService', () => {
  let service: ParameterujiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterujiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
