import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDetComponent } from './lab-det.component';

describe('LabDetComponent', () => {
  let component: LabDetComponent;
  let fixture: ComponentFixture<LabDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
