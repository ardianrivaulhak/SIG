import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportkpiComponent } from './reportkpi.component';

describe('ReportkpiComponent', () => {
  let component: ReportkpiComponent;
  let fixture: ComponentFixture<ReportkpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportkpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportkpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
