import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAttachmentSeeComponent } from './modal-attachment-see.component';

describe('ModalAttachmentSeeComponent', () => {
  let component: ModalAttachmentSeeComponent;
  let fixture: ComponentFixture<ModalAttachmentSeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAttachmentSeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAttachmentSeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
