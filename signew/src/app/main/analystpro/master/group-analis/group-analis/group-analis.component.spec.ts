import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAnalisComponent } from '../group-analis/group-analis.component';

describe('GroupAnalisComponent', () => {
  let component: GroupAnalisComponent;
  let fixture: ComponentFixture<GroupAnalisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAnalisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAnalisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
