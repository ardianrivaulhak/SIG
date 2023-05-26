import { TestBed } from '@angular/core/testing';

import { AverageserviceService } from './averageservice.service';

describe('AverageserviceService', () => {
  let service: AverageserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
