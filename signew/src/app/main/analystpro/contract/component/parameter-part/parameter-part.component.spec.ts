import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterPartComponent } from './parameter-part.component';

describe('ParameterPartComponent', () => {
  let component: ParameterPartComponent;
  let fixture: ComponentFixture<ParameterPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
