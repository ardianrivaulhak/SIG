import { TestBed } from '@angular/core/testing';

import { ModalLateYearService } from './modal-late-year.service';

describe('ModalLateYearService', () => {
  let service: ModalLateYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLateYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
