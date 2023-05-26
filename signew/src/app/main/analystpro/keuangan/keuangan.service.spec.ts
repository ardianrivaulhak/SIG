import { TestBed } from '@angular/core/testing';

import { KeuanganService } from './keuangan.service';

describe('KeuanganService', () => {
  let service: KeuanganService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeuanganService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
