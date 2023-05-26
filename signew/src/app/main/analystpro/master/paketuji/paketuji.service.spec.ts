import { TestBed } from '@angular/core/testing';

import { PaketujiService } from './paketuji.service';

describe('PaketujiService', () => {
  let service: PaketujiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaketujiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
