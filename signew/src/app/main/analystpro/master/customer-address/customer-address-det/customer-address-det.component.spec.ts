import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddressDetComponent } from './customer-address-det.component';

describe('CustomerAddressDetComponent', () => {
  let component: CustomerAddressDetComponent;
  let fixture: ComponentFixture<CustomerAddressDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddressDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddressDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
