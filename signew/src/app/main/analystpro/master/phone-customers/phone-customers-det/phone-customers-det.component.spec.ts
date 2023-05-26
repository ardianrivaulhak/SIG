import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCustomersDetComponent } from './phone-customers-det.component';

describe('PhoneCustomersDetComponent', () => {
  let component: PhoneCustomersDetComponent;
  let fixture: ComponentFixture<PhoneCustomersDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneCustomersDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCustomersDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
