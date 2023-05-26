import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderDetComponent } from './finder-det.component';

describe('FinderDetComponent', () => {
  let component: FinderDetComponent;
  let fixture: ComponentFixture<FinderDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
