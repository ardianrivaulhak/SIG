import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveInvoiceComponent } from './approve-invoice.component';

describe('ApproveInvoiceComponent', () => {
  let component: ApproveInvoiceComponent;
  let fixture: ComponentFixture<ApproveInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
