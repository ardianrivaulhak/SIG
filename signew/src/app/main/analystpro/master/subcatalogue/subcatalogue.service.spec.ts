import { TestBed } from '@angular/core/testing';

import { SubcatalogueService } from './subcatalogue.service';

describe('SubcatalogueService', () => {
  let service: SubcatalogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcatalogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
