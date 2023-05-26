import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetComponent } from './group-det.component';

describe('GroupDetComponent', () => {
  let component: GroupDetComponent;
  let fixture: ComponentFixture<GroupDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
