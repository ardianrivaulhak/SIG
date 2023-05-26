import { TestBed } from '@angular/core/testing';

import { LabApprovalService } from './lab-approval.service';

describe('LabApprovalService', () => {
  let service: LabApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
