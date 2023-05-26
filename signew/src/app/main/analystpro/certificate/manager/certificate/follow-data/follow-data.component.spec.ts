import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowDataComponent } from './follow-data.component';

describe('FollowDataComponent', () => {
  let component: FollowDataComponent;
  let fixture: ComponentFixture<FollowDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
