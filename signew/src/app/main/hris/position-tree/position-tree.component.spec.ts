import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTreeComponent } from './position-tree.component';

describe('PositionTreeComponent', () => {
  let component: PositionTreeComponent;
  let fixture: ComponentFixture<PositionTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
