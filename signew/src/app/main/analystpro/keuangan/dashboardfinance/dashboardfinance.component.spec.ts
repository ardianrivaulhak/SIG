import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardfinanceComponent } from './dashboardfinance.component';

describe('DashboardfinanceComponent', () => {
  let component: DashboardfinanceComponent;
  let fixture: ComponentFixture<DashboardfinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardfinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardfinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
