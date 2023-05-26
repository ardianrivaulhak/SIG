import { TestBed } from '@angular/core/testing';

import { TujuanpengujianService } from './tujuanpengujian.service';

describe('TujuanpengujianService', () => {
  let service: TujuanpengujianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TujuanpengujianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
