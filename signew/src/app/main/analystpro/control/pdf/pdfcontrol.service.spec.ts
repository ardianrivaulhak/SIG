import { TestBed } from '@angular/core/testing';

import { PdfcontrolService } from './pdfcontrol.service';

describe('PdfcontrolService', () => {
  let service: PdfcontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfcontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
