import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHandleComponent } from './customer-handle.component';

describe('CustomerHandleComponent', () => {
  let component: CustomerHandleComponent;
  let fixture: ComponentFixture<CustomerHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
