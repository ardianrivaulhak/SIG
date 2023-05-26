import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDoneComponent } from './lab-done.component';

describe('LabDoneComponent', () => {
  let component: LabDoneComponent;
  let fixture: ComponentFixture<LabDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
