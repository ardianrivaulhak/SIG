import { TestBed } from '@angular/core/testing';

import { SisterCompanyService } from './sister-company.service';

describe('SisterCompanyService', () => {
  let service: SisterCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SisterCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
