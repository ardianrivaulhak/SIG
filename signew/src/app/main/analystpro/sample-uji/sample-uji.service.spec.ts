import { TestBed } from '@angular/core/testing';

import { SampleUjiService } from './sample-uji.service';

describe('SampleUjiService', () => {
  let service: SampleUjiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleUjiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
