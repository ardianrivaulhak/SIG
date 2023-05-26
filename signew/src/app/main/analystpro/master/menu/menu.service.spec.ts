import { TestBed } from '@angular/core/testing';

import { MenuServices } from './menu.service';

describe('MenuService', () => {
  let service: MenuServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
