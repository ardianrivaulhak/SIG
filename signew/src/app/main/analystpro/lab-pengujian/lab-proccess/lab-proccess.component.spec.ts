import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabProccessComponent } from './lab-proccess.component';

describe('LabProccessComponent', () => {
  let component: LabProccessComponent;
  let fixture: ComponentFixture<LabProccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabProccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
