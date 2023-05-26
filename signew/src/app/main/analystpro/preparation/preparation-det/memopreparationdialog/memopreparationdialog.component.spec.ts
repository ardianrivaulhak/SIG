import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemopreparationdialogComponent } from './memopreparationdialog.component';

describe('MemopreparationdialogComponent', () => {
  let component: MemopreparationdialogComponent;
  let fixture: ComponentFixture<MemopreparationdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemopreparationdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemopreparationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
