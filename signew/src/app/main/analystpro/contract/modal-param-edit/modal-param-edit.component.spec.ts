import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParamEditComponent } from './modal-param-edit.component';

describe('ModalParamEditComponent', () => {
  let component: ModalParamEditComponent;
  let fixture: ComponentFixture<ModalParamEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParamEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
