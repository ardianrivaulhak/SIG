import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKendaliComponent } from './modal-kendali.component';

describe('ModalKendaliComponent', () => {
  let component: ModalKendaliComponent;
  let fixture: ComponentFixture<ModalKendaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalKendaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalKendaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
