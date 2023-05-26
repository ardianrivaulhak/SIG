import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAttendanceComponent } from './status-attendance.component';

describe('StatusAttendanceComponent', () => {
  let component: StatusAttendanceComponent;
  let fixture: ComponentFixture<StatusAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
