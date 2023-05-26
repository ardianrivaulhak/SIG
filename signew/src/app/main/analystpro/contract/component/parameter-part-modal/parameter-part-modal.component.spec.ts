import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterPartModalComponent } from './parameter-part-modal.component';

describe('ParameterPartModalComponent', () => {
  let component: ParameterPartModalComponent;
  let fixture: ComponentFixture<ParameterPartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterPartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterPartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
