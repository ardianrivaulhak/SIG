import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeementStatusComponent } from './employeement-status.component';

describe('EmployeementStatusComponent', () => {
  let component: EmployeementStatusComponent;
  let fixture: ComponentFixture<EmployeementStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeementStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
