import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystproComponent } from './analystpro.component';

describe('AnalystproComponent', () => {
  let component: AnalystproComponent;
  let fixture: ComponentFixture<AnalystproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
