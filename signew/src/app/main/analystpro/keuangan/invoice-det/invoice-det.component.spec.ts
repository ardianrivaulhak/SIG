import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetComponent } from './invoice-det.component';

describe('InvoiceDetComponent', () => {
  let component: InvoiceDetComponent;
  let fixture: ComponentFixture<InvoiceDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
