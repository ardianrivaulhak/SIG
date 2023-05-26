import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetComponent } from './employee-det.component';

describe('EmployeeDetComponent', () => {
  let component: EmployeeDetComponent;
  let fixture: ComponentFixture<EmployeeDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
