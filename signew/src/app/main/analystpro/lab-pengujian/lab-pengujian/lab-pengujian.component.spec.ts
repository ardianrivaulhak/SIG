import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPengujianComponent } from './lab-pengujian.component';

describe('LabPengujianComponent', () => {
  let component: LabPengujianComponent;
  let fixture: ComponentFixture<LabPengujianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabPengujianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPengujianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
