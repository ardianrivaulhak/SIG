import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoInternalComponent } from './memo-internal.component';

describe('MemoInternalComponent', () => {
  let component: MemoInternalComponent;
  let fixture: ComponentFixture<MemoInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
