import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailEditContractComponent } from './modal-detail-edit-contract.component';

describe('ModalDetailEditContractComponent', () => {
  let component: ModalDetailEditContractComponent;
  let fixture: ComponentFixture<ModalDetailEditContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetailEditContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailEditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
