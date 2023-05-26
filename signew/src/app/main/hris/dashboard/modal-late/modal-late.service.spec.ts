import { TestBed } from '@angular/core/testing';

import { ModalLateService } from './modal-late.service';

describe('ModalLateService', () => {
  let service: ModalLateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
