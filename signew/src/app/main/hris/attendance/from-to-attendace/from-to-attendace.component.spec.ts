import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromToAttendaceComponent } from './from-to-attendace.component';

describe('FromToAttendaceComponent', () => {
  let component: FromToAttendaceComponent;
  let fixture: ComponentFixture<FromToAttendaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromToAttendaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromToAttendaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
