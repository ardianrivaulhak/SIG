import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionprepComponent } from './actionprep.component';

describe('ActionprepComponent', () => {
  let component: ActionprepComponent;
  let fixture: ComponentFixture<ActionprepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionprepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionprepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
