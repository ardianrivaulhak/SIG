import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingParameterComponent } from './listing-parameter.component';

describe('ListingParameterComponent', () => {
  let component: ListingParameterComponent;
  let fixture: ComponentFixture<ListingParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
