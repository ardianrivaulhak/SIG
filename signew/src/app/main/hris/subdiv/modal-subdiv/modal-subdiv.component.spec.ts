import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubdivComponent } from './modal-subdiv.component';

describe('ModalSubdivComponent', () => {
  let component: ModalSubdivComponent;
  let fixture: ComponentFixture<ModalSubdivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSubdivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubdivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
