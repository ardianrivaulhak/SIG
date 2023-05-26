import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktrackComponent } from './backtrack.component';

describe('BacktrackComponent', () => {
  let component: BacktrackComponent;
  let fixture: ComponentFixture<BacktrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacktrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacktrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
