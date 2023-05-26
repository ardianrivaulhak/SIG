import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromToAnalystproComponent } from './from-to-analystpro.component';

describe('FromToAnalystproComponent', () => {
  let component: FromToAnalystproComponent;
  let fixture: ComponentFixture<FromToAnalystproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromToAnalystproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromToAnalystproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
