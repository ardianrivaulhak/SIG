import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDateModalsComponent } from './report-date-modals.component';

describe('ReportDateModalsComponent', () => {
  let component: ReportDateModalsComponent;
  let fixture: ComponentFixture<ReportDateModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDateModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDateModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
