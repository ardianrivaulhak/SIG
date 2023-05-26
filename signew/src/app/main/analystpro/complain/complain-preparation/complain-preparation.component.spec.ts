import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainPreparationComponent } from './complain-preparation.component';

describe('ComplainPreparationComponent', () => {
  let component: ComplainPreparationComponent;
  let fixture: ComponentFixture<ComplainPreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainPreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
