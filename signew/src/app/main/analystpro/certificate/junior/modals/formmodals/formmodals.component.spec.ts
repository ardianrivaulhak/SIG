import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormmodalsComponent } from './formmodals.component';

describe('FormmodalsComponent', () => {
  let component: FormmodalsComponent;
  let fixture: ComponentFixture<FormmodalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormmodalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormmodalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
