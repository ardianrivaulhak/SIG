import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaketParameterComponent } from './modal-paket-parameter.component';

describe('ModalPaketParameterComponent', () => {
  let component: ModalPaketParameterComponent;
  let fixture: ComponentFixture<ModalPaketParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaketParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaketParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
