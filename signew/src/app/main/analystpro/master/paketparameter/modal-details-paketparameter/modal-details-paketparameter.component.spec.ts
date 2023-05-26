import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsPaketparameterComponent } from './modal-details-paketparameter.component';

describe('ModalDetailsPaketparameterComponent', () => {
  let component: ModalDetailsPaketparameterComponent;
  let fixture: ComponentFixture<ModalDetailsPaketparameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetailsPaketparameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailsPaketparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
