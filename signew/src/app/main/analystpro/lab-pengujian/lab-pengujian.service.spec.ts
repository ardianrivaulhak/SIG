import { TestBed } from '@angular/core/testing';

import { LabPengujianService } from './lab-pengujian.service';

describe('LabPengujianService', () => {
  let service: LabPengujianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabPengujianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
