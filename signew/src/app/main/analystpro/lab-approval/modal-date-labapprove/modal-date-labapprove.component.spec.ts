import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDateLabapproveComponent } from './modal-date-labapprove.component';

describe('ModalDateLabapproveComponent', () => {
  let component: ModalDateLabapproveComponent;
  let fixture: ComponentFixture<ModalDateLabapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDateLabapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDateLabapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
