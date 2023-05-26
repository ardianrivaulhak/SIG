import { TestBed } from '@angular/core/testing';

import { ChatInternalService } from './chat-internal.service';

describe('ChatInternalService', () => {
  let service: ChatInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
