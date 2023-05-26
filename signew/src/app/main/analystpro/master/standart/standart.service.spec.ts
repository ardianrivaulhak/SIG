import { TestBed } from '@angular/core/testing';

import { StandartService } from './standart.service';

describe('StandartService', () => {
  let service: StandartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
