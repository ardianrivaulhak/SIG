import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingProductComponent } from './sending-product.component';

describe('SendingProductComponent', () => {
  let component: SendingProductComponent;
  let fixture: ComponentFixture<SendingProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendingProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
