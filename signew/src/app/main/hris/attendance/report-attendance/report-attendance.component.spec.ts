import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAttendanceComponent } from './report-attendance.component';

describe('ReportAttendanceComponent', () => {
  let component: ReportAttendanceComponent;
  let fixture: ComponentFixture<ReportAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
