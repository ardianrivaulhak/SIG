import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetComponent } from './customer-det.component';

describe('CustomerDetComponent', () => {
  let component: CustomerDetComponent;
  let fixture: ComponentFixture<CustomerDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
