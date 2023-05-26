import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRulesComponent } from './modal-rules.component';

describe('ModalRulesComponent', () => {
  let component: ModalRulesComponent;
  let fixture: ComponentFixture<ModalRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
