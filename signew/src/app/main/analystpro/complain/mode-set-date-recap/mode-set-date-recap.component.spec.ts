import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeSetDateRecapComponent } from './mode-set-date-recap.component';

describe('ModeSetDateRecapComponent', () => {
  let component: ModeSetDateRecapComponent;
  let fixture: ComponentFixture<ModeSetDateRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeSetDateRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeSetDateRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
