import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateCommentComponent } from './modal-late-comment.component';

describe('ModalLateCommentComponent', () => {
  let component: ModalLateCommentComponent;
  let fixture: ComponentFixture<ModalLateCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
