import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertaxaddressComponent } from './customertaxaddress.component';

describe('CustomertaxaddressComponent', () => {
  let component: CustomertaxaddressComponent;
  let fixture: ComponentFixture<CustomertaxaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomertaxaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomertaxaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
