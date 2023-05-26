import { TestBed } from '@angular/core/testing';

import { MediartuPartialService } from './mediartu-partial.service';

describe('MediartuPartialService', () => {
  let service: MediartuPartialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediartuPartialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
