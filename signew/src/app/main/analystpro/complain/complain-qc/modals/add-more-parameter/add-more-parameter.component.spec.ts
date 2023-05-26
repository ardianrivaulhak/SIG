import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreParameterComponent } from './add-more-parameter.component';

describe('AddMoreParameterComponent', () => {
  let component: AddMoreParameterComponent;
  let fixture: ComponentFixture<AddMoreParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
