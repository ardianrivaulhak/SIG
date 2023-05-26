import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentcashierComponent } from './paymentcashier.component';

describe('PaymentcashierComponent', () => {
  let component: PaymentcashierComponent;
  let fixture: ComponentFixture<PaymentcashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentcashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentcashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
