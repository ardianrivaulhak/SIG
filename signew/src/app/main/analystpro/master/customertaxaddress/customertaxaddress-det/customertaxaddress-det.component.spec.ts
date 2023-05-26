import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertaxaddressDetComponent } from './customertaxaddress-det.component';

describe('CustomertaxaddressDetComponent', () => {
  let component: CustomertaxaddressDetComponent;
  let fixture: ComponentFixture<CustomertaxaddressDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomertaxaddressDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomertaxaddressDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
