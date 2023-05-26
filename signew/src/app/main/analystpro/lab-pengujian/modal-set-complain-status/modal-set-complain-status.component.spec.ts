import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSetComplainStatusComponent } from './modal-set-complain-status.component';

describe('ModalSetComplainStatusComponent', () => {
  let component: ModalSetComplainStatusComponent;
  let fixture: ComponentFixture<ModalSetComplainStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSetComplainStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSetComplainStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
