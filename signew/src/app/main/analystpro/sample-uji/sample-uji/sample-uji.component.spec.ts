import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleUjiComponent } from './sample-uji.component';

describe('SampleUjiComponent', () => {
  let component: SampleUjiComponent;
  let fixture: ComponentFixture<SampleUjiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleUjiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleUjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
