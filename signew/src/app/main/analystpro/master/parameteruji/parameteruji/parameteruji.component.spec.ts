import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterujiComponent } from './parameteruji.component';

describe('ParameterujiComponent', () => {
  let component: ParameterujiComponent;
  let fixture: ComponentFixture<ParameterujiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterujiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterujiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
