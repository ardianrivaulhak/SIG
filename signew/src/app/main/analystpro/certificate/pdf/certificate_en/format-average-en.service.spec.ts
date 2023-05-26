import { TestBed } from '@angular/core/testing';

import { FormatAverageEnService } from './format-average-en.service';

describe('FormatAverageEnService', () => {
  let service: FormatAverageEnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatAverageEnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
