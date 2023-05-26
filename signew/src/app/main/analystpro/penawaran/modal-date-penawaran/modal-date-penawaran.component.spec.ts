import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDatePenawaranComponent } from './modal-date-penawaran.component';

describe('ModalDatePenawaranComponent', () => {
  let component: ModalDatePenawaranComponent;
  let fixture: ComponentFixture<ModalDatePenawaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDatePenawaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDatePenawaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
