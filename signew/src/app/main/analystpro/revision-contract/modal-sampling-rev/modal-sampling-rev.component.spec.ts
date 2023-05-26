import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSamplingRevComponent } from './modal-sampling-rev.component';

describe('ModalSamplingRevComponent', () => {
  let component: ModalSamplingRevComponent;
  let fixture: ComponentFixture<ModalSamplingRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSamplingRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSamplingRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
