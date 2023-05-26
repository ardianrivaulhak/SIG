import { TestBed } from '@angular/core/testing';

import { ContractTrackService } from './contract-track.service';

describe('ContractTrackService', () => {
  let service: ContractTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
