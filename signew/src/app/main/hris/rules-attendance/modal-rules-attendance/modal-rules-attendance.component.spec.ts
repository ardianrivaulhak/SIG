import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRulesAttendanceComponent } from './modal-rules-attendance.component';

describe('ModalRulesAttendanceComponent', () => {
  let component: ModalRulesAttendanceComponent;
  let fixture: ComponentFixture<ModalRulesAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRulesAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRulesAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
