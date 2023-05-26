import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateYearComponent } from './modal-late-year.component';

describe('ModalLateYearComponent', () => {
  let component: ModalLateYearComponent;
  let fixture: ComponentFixture<ModalLateYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
