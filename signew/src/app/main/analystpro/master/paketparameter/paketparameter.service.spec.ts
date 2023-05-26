import { TestBed } from '@angular/core/testing';

import { PaketparameterService } from './paketparameter.service';

describe('PaketparameterService', () => {
  let service: PaketparameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaketparameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
