import { TestBed } from '@angular/core/testing';

import { PenawaranService } from './penawaran.service';

describe('PenawaranService', () => {
  let service: PenawaranService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenawaranService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
