import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPicComponent } from './modal-edit-pic.component';

describe('ModalEditPicComponent', () => {
  let component: ModalEditPicComponent;
  let fixture: ComponentFixture<ModalEditPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
