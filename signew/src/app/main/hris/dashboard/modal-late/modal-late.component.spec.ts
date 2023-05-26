import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateComponent } from './modal-late.component';

describe('ModalLateComponent', () => {
  let component: ModalLateComponent;
  let fixture: ComponentFixture<ModalLateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
