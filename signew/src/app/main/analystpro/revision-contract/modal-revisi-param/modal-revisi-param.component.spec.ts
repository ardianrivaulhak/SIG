import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRevisiParamComponent } from './modal-revisi-param.component';

describe('ModalRevisiParamComponent', () => {
  let component: ModalRevisiParamComponent;
  let fixture: ComponentFixture<ModalRevisiParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRevisiParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRevisiParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
