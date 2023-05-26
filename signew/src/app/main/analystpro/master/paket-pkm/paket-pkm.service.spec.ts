import { TestBed } from '@angular/core/testing';

import { PaketPkmService } from './paket-pkm.service';

describe('PaketPkmService', () => {
  let service: PaketPkmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaketPkmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
