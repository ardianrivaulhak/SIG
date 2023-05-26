import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPartComponent } from './pricing-part.component';

describe('PricingPartComponent', () => {
  let component: PricingPartComponent;
  let fixture: ComponentFixture<PricingPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
