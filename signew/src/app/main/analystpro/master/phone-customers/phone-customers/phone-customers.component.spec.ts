import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCustomersComponent } from './phone-customers.component';

describe('PhoneCustomersComponent', () => {
  let component: PhoneCustomersComponent;
  let fixture: ComponentFixture<PhoneCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
