import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleApproveModalComponent } from './sample-approve-modal.component';

describe('SampleApproveModalComponent', () => {
  let component: SampleApproveModalComponent;
  let fixture: ComponentFixture<SampleApproveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleApproveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleApproveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
