import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxAddressCustomerComponent } from './tax-address-customer.component';

describe('TaxAddressCustomerComponent', () => {
  let component: TaxAddressCustomerComponent;
  let fixture: ComponentFixture<TaxAddressCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxAddressCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxAddressCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
