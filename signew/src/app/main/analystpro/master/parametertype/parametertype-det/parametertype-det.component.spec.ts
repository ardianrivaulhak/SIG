import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametertypeDetComponent } from './parametertype-det.component';

describe('ParametertypeDetComponent', () => {
  let component: ParametertypeDetComponent;
  let fixture: ComponentFixture<ParametertypeDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametertypeDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametertypeDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
