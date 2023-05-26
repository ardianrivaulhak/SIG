import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametertypeComponent } from './parametertype.component';

describe('ParametertypeComponent', () => {
  let component: ParametertypeComponent;
  let fixture: ComponentFixture<ParametertypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametertypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
