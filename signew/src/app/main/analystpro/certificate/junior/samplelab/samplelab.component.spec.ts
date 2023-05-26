import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplelabComponent } from './samplelab.component';

describe('SamplelabComponent', () => {
  let component: SamplelabComponent;
  let fixture: ComponentFixture<SamplelabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplelabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplelabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
