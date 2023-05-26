import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNotestoComponent } from './employee-notesto.component';

describe('EmployeeNotestoComponent', () => {
  let component: EmployeeNotestoComponent;
  let fixture: ComponentFixture<EmployeeNotestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeNotestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNotestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
