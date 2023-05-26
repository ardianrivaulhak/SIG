import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfCertificateComponent } from './pdf-certificate.component';

describe('PdfCertificateComponent', () => {
  let component: PdfCertificateComponent;
  let fixture: ComponentFixture<PdfCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
