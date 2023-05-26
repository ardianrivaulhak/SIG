import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParameterlistComponent } from './modal-parameterlist.component';

describe('ModalParameterlistComponent', () => {
  let component: ModalParameterlistComponent;
  let fixture: ComponentFixture<ModalParameterlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParameterlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParameterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
