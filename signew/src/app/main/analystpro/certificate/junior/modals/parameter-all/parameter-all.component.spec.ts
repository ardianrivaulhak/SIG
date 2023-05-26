import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterAllComponent } from './parameter-all.component';

describe('ParameterAllComponent', () => {
  let component: ParameterAllComponent;
  let fixture: ComponentFixture<ParameterAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
