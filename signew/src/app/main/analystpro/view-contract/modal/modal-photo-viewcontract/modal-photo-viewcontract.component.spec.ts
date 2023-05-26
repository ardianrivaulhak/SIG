import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPhotoViewcontractComponent } from './modal-photo-viewcontract.component';

describe('ModalPhotoViewcontractComponent', () => {
  let component: ModalPhotoViewcontractComponent;
  let fixture: ComponentFixture<ModalPhotoViewcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPhotoViewcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPhotoViewcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
