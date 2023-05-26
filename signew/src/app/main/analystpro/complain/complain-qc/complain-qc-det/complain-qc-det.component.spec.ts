import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainQcDetComponent } from './complain-qc-det.component';

describe('ComplainQcDetComponent', () => {
  let component: ComplainQcDetComponent;
  let fixture: ComponentFixture<ComplainQcDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainQcDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainQcDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
