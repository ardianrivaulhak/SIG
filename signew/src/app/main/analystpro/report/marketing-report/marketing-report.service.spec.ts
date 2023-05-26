import { TestBed } from '@angular/core/testing';

import { MarketingReportService } from './marketing-report.service';

describe('MarketingReportService', () => {
  let service: MarketingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
