import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDepartemenComponent } from './modal-departemen.component';

describe('ModalDepartemenComponent', () => {
  let component: ModalDepartemenComponent;
  let fixture: ComponentFixture<ModalDepartemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDepartemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDepartemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
