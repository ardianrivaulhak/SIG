import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametermodalsComponent } from './parametermodals.component';

describe('ParametermodalsComponent', () => {
  let component: ParametermodalsComponent;
  let fixture: ComponentFixture<ParametermodalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametermodalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametermodalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
