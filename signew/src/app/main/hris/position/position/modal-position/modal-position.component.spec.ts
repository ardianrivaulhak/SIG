import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPositionComponent } from './modal-position.component';

describe('ModalPositionComponent', () => {
  let component: ModalPositionComponent;
  let fixture: ComponentFixture<ModalPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
