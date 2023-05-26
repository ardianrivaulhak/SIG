import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDateComponentFinder } from './modal-date.component';

describe('ModalDateComponentFinder', () => {
  let component: ModalDateComponentFinder;
  let fixture: ComponentFixture<ModalDateComponentFinder>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDateComponentFinder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDateComponentFinder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
