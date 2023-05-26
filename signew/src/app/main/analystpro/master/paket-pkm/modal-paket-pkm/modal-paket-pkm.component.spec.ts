import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaketPkmComponent } from './modal-paket-pkm.component';

describe('ModalPaketPkmComponent', () => {
  let component: ModalPaketPkmComponent;
  let fixture: ComponentFixture<ModalPaketPkmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaketPkmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaketPkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
