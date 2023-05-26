import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeementDetailComponent } from './employeement-detail.component';

describe('EmployeementDetailComponent', () => {
  let component: EmployeementDetailComponent;
  let fixture: ComponentFixture<EmployeementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
