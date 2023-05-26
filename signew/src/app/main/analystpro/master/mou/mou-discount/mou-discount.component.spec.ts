import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouDiscountComponent } from './mou-discount.component';

describe('MouDiscountComponent', () => {
  let component: MouDiscountComponent;
  let fixture: ComponentFixture<MouDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
