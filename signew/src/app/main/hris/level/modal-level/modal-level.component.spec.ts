import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLevelComponent } from './modal-level.component';

describe('ModalLevelComponent', () => {
  let component: ModalLevelComponent;
  let fixture: ComponentFixture<ModalLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
