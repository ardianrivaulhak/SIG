import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAttendanceComponent } from './rules-attendance.component';

describe('RulesAttendanceComponent', () => {
  let component: RulesAttendanceComponent;
  let fixture: ComponentFixture<RulesAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
