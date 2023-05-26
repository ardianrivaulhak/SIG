import { TestBed } from '@angular/core/testing';

import { EdocsService } from './edocs.service';

describe('EdocsService', () => {
  let service: EdocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
