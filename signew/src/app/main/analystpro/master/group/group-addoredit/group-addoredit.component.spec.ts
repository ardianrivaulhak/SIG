import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddoreditComponent } from './group-addoredit.component';

describe('GroupAddoreditComponent', () => {
  let component: GroupAddoreditComponent;
  let fixture: ComponentFixture<GroupAddoreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAddoreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAddoreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
