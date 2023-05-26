import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKendaliDetailComponent } from './modal-kendali-detail.component';

describe('ModalKendaliDetailComponent', () => {
  let component: ModalKendaliDetailComponent;
  let fixture: ComponentFixture<ModalKendaliDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalKendaliDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalKendaliDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
