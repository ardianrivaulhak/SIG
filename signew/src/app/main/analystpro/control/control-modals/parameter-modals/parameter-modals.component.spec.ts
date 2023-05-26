import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterModalsComponent } from './parameter-modals.component';

describe('ParameterModalsComponent', () => {
  let component: ParameterModalsComponent;
  let fixture: ComponentFixture<ParameterModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
