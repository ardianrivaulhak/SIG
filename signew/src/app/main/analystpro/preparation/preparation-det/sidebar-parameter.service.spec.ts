import { TestBed } from '@angular/core/testing';

import { SidebarParameterService } from './sidebar-parameter.service';

describe('SidebarParameterService', () => {
  let service: SidebarParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
