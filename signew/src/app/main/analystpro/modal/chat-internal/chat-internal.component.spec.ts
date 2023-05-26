import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInternalComponent } from './chat-internal.component';

describe('ChatInternalComponent', () => {
  let component: ChatInternalComponent;
  let fixture: ComponentFixture<ChatInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
