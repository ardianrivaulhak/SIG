import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlParameterComponent } from './control-parameter.component';

describe('ControlParameterComponent', () => {
  let component: ControlParameterComponent;
  let fixture: ComponentFixture<ControlParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
