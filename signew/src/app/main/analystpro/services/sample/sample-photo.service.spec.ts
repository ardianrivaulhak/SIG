import { TestBed } from '@angular/core/testing';

import { SamplePhotoService } from './sample-photo.service';

describe('SamplePhotoService', () => {
  let service: SamplePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamplePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
