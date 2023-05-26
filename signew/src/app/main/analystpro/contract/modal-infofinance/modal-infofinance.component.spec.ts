import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfofinanceComponent } from './modal-infofinance.component';

describe('ModalInfofinanceComponent', () => {
  let component: ModalInfofinanceComponent;
  let fixture: ComponentFixture<ModalInfofinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfofinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfofinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
