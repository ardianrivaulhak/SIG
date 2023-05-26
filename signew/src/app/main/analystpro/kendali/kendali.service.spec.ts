import { TestBed } from '@angular/core/testing';

import { KendaliService } from './kendali.service';

describe('KendaliService', () => {
  let service: KendaliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KendaliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
