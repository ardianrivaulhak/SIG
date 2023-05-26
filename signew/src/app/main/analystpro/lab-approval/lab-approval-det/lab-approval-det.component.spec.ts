import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabApprovalDetComponent } from './lab-approval-det.component';

describe('LabApprovalDetComponent', () => {
  let component: LabApprovalDetComponent;
  let fixture: ComponentFixture<LabApprovalDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabApprovalDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabApprovalDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
