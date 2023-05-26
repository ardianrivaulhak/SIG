import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleInformationModalComponent } from './sample-information-modal.component';

describe('SampleInformationModalComponent', () => {
  let component: SampleInformationModalComponent;
  let fixture: ComponentFixture<SampleInformationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleInformationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
