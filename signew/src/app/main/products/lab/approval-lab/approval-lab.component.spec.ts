import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLabComponent } from './approval-lab.component';

describe('ApprovalLabComponent', () => {
  let component: ApprovalLabComponent;
  let fixture: ComponentFixture<ApprovalLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
