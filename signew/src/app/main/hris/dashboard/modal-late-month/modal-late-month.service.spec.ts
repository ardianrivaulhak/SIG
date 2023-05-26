import { TestBed } from '@angular/core/testing';

import { ModalLateMonthService } from './modal-late-month.service';

describe('ModalLateMonthService', () => {
  let service: ModalLateMonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLateMonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
