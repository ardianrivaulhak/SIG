import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemocontroldialogComponent } from './memocontroldialog.component';

describe('MemocontroldialogComponent', () => {
  let component: MemocontroldialogComponent;
  let fixture: ComponentFixture<MemocontroldialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemocontroldialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemocontroldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
