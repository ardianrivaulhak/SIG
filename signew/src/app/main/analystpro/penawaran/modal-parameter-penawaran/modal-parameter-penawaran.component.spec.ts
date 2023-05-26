import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParameterPenawaranComponent } from './modal-parameter-penawaran.component';

describe('ModalParameterPenawaranComponent', () => {
  let component: ModalParameterPenawaranComponent;
  let fixture: ComponentFixture<ModalParameterPenawaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParameterPenawaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParameterPenawaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
