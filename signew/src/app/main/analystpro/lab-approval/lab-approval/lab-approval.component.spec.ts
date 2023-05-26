import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabApprovalComponent } from './lab-approval.component';

describe('LabApprovalComponent', () => {
  let component: LabApprovalComponent;
  let fixture: ComponentFixture<LabApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
