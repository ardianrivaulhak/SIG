import { TestBed } from '@angular/core/testing';

import { ParametertypeService } from './parametertype.service';

describe('ParametertypeService', () => {
  let service: ParametertypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametertypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
