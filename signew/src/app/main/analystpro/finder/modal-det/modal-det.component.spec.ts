import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetComponent } from './modal-det.component';

describe('ModalDetComponent', () => {
  let component: ModalDetComponent;
  let fixture: ComponentFixture<ModalDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
