import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailinvoiceproductComponent } from './detailinvoiceproduct.component';

describe('DetailinvoiceproductComponent', () => {
  let component: DetailinvoiceproductComponent;
  let fixture: ComponentFixture<DetailinvoiceproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailinvoiceproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailinvoiceproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
