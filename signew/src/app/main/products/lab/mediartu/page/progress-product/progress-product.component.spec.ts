import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressProductComponent } from './progress-product.component';

describe('ProgressProductComponent', () => {
  let component: ProgressProductComponent;
  let fixture: ComponentFixture<ProgressProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
