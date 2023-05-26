import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailApproveComponent } from './detail-approve.component';

describe('DetailApproveComponent', () => {
  let component: DetailApproveComponent;
  let fixture: ComponentFixture<DetailApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
