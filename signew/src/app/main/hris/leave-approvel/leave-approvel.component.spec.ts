import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApprovelComponent } from './leave-approvel.component';

describe('LeaveApprovelComponent', () => {
  let component: LeaveApprovelComponent;
  let fixture: ComponentFixture<LeaveApprovelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApprovelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApprovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
