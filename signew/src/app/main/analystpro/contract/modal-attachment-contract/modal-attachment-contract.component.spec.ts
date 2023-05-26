import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAttachmentContractComponent } from './modal-attachment-contract.component';

describe('ModalAttachmentContractComponent', () => {
  let component: ModalAttachmentContractComponent;
  let fixture: ComponentFixture<ModalAttachmentContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAttachmentContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAttachmentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
