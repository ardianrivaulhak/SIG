import { TestBed } from '@angular/core/testing';

import { MouService } from './mou.service';

describe('MouService', () => {
  let service: MouService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
