import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOtherTeamComponent } from './select-other-team.component';

describe('SelectOtherTeamComponent', () => {
  let component: SelectOtherTeamComponent;
  let fixture: ComponentFixture<SelectOtherTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOtherTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOtherTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
