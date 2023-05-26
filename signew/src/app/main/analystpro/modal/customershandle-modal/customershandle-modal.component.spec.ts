import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomershandleModalComponent } from './customershandle-modal.component';

describe('CustomershandleModalComponent', () => {
  let component: CustomershandleModalComponent;
  let fixture: ComponentFixture<CustomershandleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomershandleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomershandleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
