import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFollowComponent } from './data-follow.component';

describe('DataFollowComponent', () => {
  let component: DataFollowComponent;
  let fixture: ComponentFixture<DataFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
