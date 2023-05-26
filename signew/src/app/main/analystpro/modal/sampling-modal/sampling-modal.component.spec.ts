import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingModalComponent } from './sampling-modal.component';

describe('SamplingModalComponent', () => {
  let component: SamplingModalComponent;
  let fixture: ComponentFixture<SamplingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
