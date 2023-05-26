import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComplaintComponent } from './action-complaint.component';

describe('ActionComplaintComponent', () => {
  let component: ActionComplaintComponent;
  let fixture: ComponentFixture<ActionComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
