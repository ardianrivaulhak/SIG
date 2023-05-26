import { TestBed } from '@angular/core/testing';

import { ModalLateYesterdayService } from './modal-late-yesterday.service';

describe('ModalLateYesterdayService', () => {
  let service: ModalLateYesterdayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLateYesterdayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
