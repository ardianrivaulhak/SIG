import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVocComponent } from './modal-voc.component';

describe('ModalVocComponent', () => {
  let component: ModalVocComponent;
  let fixture: ComponentFixture<ModalVocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
