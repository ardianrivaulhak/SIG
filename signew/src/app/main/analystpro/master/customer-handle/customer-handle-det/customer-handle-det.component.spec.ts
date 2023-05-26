import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHandleDetComponent } from './customer-handle-det.component';

describe('CustomerHandleDetComponent', () => {
  let component: CustomerHandleDetComponent;
  let fixture: ComponentFixture<CustomerHandleDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerHandleDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHandleDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
