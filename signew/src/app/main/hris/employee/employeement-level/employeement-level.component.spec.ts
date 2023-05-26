import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeementLevelComponent } from './employeement-level.component';

describe('EmployeementLevelComponent', () => {
  let component: EmployeementLevelComponent;
  let fixture: ComponentFixture<EmployeementLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeementLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeementLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
