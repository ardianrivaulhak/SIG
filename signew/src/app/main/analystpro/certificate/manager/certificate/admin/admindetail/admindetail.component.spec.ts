import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindetailComponent } from './admindetail.component';

describe('AdmindetailComponent', () => {
  let component: AdmindetailComponent;
  let fixture: ComponentFixture<AdmindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
