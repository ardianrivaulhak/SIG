import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeConditionComponent } from './change-condition.component';

describe('ChangeConditionComponent', () => {
  let component: ChangeConditionComponent;
  let fixture: ComponentFixture<ChangeConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
