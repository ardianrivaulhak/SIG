import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSamplingContractComponent } from './modal-sampling-contract.component';

describe('ModalSamplingContractComponent', () => {
  let component: ModalSamplingContractComponent;
  let fixture: ComponentFixture<ModalSamplingContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSamplingContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSamplingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
