import { TestBed } from '@angular/core/testing';

import { StatusAttendanceService } from './status-attendance.service';

describe('StatusAttendanceService', () => {
  let service: StatusAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
