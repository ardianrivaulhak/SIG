import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCustomerComponent } from './address-customer.component';

describe('AddressCustomerComponent', () => {
  let component: AddressCustomerComponent;
  let fixture: ComponentFixture<AddressCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
