import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAkgContractComponent } from './modal-akg-contract.component';

describe('ModalAkgContractComponent', () => {
  let component: ModalAkgContractComponent;
  let fixture: ComponentFixture<ModalAkgContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAkgContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAkgContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
