import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdivComponent } from './subdiv.component';

describe('SubdivComponent', () => {
  let component: SubdivComponent;
  let fixture: ComponentFixture<SubdivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubdivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
