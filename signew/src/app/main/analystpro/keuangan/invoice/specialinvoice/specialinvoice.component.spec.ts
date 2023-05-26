import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialinvoiceComponent } from './specialinvoice.component';

describe('SpecialinvoiceComponent', () => {
  let component: SpecialinvoiceComponent;
  let fixture: ComponentFixture<SpecialinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
