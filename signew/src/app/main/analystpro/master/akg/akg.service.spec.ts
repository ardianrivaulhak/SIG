import { TestBed } from '@angular/core/testing';

import { AkgService } from './akg.service';

describe('AkgService', () => {
  let service: AkgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AkgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
