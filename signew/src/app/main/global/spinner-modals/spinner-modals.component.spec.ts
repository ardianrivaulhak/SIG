import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerModalsComponent } from './spinner-modals.component';

describe('SpinnerModalsComponent', () => {
  let component: SpinnerModalsComponent;
  let fixture: ComponentFixture<SpinnerModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
