import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingDetComponent } from './sampling-det.component';

describe('SamplingDetComponent', () => {
  let component: SamplingDetComponent;
  let fixture: ComponentFixture<SamplingDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplingDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplingDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
