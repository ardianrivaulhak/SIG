import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDateKeuanganComponent } from './modal-date-keuangan.component';

describe('ModalDateKeuanganComponent', () => {
  let component: ModalDateKeuanganComponent;
  let fixture: ComponentFixture<ModalDateKeuanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDateKeuanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDateKeuanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
