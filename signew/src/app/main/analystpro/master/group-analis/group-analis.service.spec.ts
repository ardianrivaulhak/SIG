import { TestBed } from '@angular/core/testing';

import { GroupAnalisService } from './group-analis.service';

describe('GroupAnalisService', () => {
  let service: GroupAnalisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupAnalisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
