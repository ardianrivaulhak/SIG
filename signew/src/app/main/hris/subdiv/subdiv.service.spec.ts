import { TestBed } from '@angular/core/testing';

import { SubdivService } from './subdiv.service';

describe('SubdivService', () => {
  let service: SubdivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubdivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
