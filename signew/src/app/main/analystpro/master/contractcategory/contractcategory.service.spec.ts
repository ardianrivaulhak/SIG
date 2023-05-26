import { TestBed } from '@angular/core/testing';

import { ContractcategoryService } from './contractcategory.service';

describe('ContractcategoryService', () => {
  let service: ContractcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
