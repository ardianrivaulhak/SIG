import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditContractComponent } from './modal-edit-contract.component';

describe('ModalEditContractComponent', () => {
  let component: ModalEditContractComponent;
  let fixture: ComponentFixture<ModalEditContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
