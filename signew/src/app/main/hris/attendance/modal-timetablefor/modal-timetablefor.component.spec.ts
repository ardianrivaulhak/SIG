import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTimetableforComponent } from './modal-timetablefor.component';

describe('ModalTimetableforComponent', () => {
  let component: ModalTimetableforComponent;
  let fixture: ComponentFixture<ModalTimetableforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTimetableforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTimetableforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
