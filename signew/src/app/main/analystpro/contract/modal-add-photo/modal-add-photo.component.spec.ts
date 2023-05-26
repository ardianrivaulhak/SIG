import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPhotoComponent } from './modal-add-photo.component';

describe('ModalAddPhotoComponent', () => {
  let component: ModalAddPhotoComponent;
  let fixture: ComponentFixture<ModalAddPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
