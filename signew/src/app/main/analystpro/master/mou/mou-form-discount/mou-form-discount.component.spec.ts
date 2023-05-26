import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouFormDiscountComponent } from './mou-form-discount.component';

describe('MouFormDiscountComponent', () => {
  let component: MouFormDiscountComponent;
  let fixture: ComponentFixture<MouFormDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouFormDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouFormDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
