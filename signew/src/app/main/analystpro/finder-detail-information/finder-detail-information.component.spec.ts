import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderDetailInformationComponent } from './finder-detail-information.component';

describe('FinderDetailInformationComponent', () => {
  let component: FinderDetailInformationComponent;
  let fixture: ComponentFixture<FinderDetailInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderDetailInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderDetailInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
