import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAkgRevComponent } from './modal-akg-rev.component';

describe('ModalAkgRevComponent', () => {
  let component: ModalAkgRevComponent;
  let fixture: ComponentFixture<ModalAkgRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAkgRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAkgRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
