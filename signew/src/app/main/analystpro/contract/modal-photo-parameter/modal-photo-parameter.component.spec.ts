import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPhotoParameterComponent } from './modal-photo-parameter.component';

describe('ModalPhotoParameterComponent', () => {
  let component: ModalPhotoParameterComponent;
  let fixture: ComponentFixture<ModalPhotoParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPhotoParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPhotoParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
