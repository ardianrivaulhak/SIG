import { TestBed } from '@angular/core/testing';

import { RulesAttendanceService } from './rules-attendance.service';

describe('RulesAttendanceService', () => {
  let service: RulesAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
