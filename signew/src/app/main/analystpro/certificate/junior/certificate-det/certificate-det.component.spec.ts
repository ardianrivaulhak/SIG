import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDetComponent } from './certificate-det.component';

describe('CertificateDetComponent', () => {
  let component: CertificateDetComponent;
  let fixture: ComponentFixture<CertificateDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
