import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveakgComponent } from './approveakg.component';

describe('ApproveakgComponent', () => {
  let component: ApproveakgComponent;
  let fixture: ComponentFixture<ApproveakgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveakgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveakgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
