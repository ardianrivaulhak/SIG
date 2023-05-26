import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDateComponent } from './modal-date.component';

describe('ModalDateComponent', () => {
  let component: ModalDateComponent;
  let fixture: ComponentFixture<ModalDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
