import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNpwpKtpComponent } from './modal-npwp-ktp.component';

describe('ModalNpwpKtpComponent', () => {
  let component: ModalNpwpKtpComponent;
  let fixture: ComponentFixture<ModalNpwpKtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNpwpKtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNpwpKtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
