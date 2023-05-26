import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainQcComponent } from './complain-qc.component';

describe('ComplainQcComponent', () => {
  let component: ComplainQcComponent;
  let fixture: ComponentFixture<ComplainQcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainQcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
