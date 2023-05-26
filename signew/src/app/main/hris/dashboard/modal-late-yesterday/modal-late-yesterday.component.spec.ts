import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateYesterdayComponent } from './modal-late-yesterday.component';

describe('ModalLateYesterdayComponent', () => {
  let component: ModalLateYesterdayComponent;
  let fixture: ComponentFixture<ModalLateYesterdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateYesterdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateYesterdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
