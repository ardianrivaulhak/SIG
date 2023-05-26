import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSetContractComponent } from './modal-set-contract.component';

describe('ModalSetContractComponent', () => {
  let component: ModalSetContractComponent;
  let fixture: ComponentFixture<ModalSetContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSetContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSetContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
