import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualcertificateComponent } from './manualcertificate.component';

describe('ManualcertificateComponent', () => {
  let component: ManualcertificateComponent;
  let fixture: ComponentFixture<ManualcertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualcertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualcertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
