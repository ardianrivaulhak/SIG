import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectationModalComponent } from './expectation-modal.component';

describe('ExpectationModalComponent', () => {
  let component: ExpectationModalComponent;
  let fixture: ComponentFixture<ExpectationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
