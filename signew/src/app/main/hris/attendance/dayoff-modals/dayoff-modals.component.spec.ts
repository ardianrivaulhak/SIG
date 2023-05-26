import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayoffModalsComponent } from './dayoff-modals.component';

describe('DayoffModalsComponent', () => {
  let component: DayoffModalsComponent;
  let fixture: ComponentFixture<DayoffModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayoffModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayoffModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
