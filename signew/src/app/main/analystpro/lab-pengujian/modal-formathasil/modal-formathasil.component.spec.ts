import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormathasilComponent } from './modal-formathasil.component';

describe('ModalFormathasilComponent', () => {
  let component: ModalFormathasilComponent;
  let fixture: ComponentFixture<ModalFormathasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFormathasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormathasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
