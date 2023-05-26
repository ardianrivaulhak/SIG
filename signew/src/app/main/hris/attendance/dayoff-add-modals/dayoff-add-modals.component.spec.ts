import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayoffAddModalsComponent } from './dayoff-add-modals.component';

describe('DayoffAddModalsComponent', () => {
  let component: DayoffAddModalsComponent;
  let fixture: ComponentFixture<DayoffAddModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayoffAddModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayoffAddModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
