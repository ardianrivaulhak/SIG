import { TestBed } from '@angular/core/testing';

import { ModalLeaveService } from './modal-leave.service';

describe('ModalLeaveService', () => {
  let service: ModalLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
