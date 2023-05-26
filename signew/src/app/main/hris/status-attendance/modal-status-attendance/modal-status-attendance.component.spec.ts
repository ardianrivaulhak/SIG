import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStatusAttendanceComponent } from './modal-status-attendance.component';

describe('ModalStatusAttendanceComponent', () => {
  let component: ModalStatusAttendanceComponent;
  let fixture: ComponentFixture<ModalStatusAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStatusAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStatusAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
