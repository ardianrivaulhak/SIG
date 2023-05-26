import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateMonthComponent } from './modal-late-month.component';

describe('ModalLateMonthComponent', () => {
  let component: ModalLateMonthComponent;
  let fixture: ComponentFixture<ModalLateMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
