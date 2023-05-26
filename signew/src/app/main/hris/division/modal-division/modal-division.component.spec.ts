import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDivisionComponent } from './modal-division.component';

describe('ModalDivisionComponent', () => {
  let component: ModalDivisionComponent;
  let fixture: ComponentFixture<ModalDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
