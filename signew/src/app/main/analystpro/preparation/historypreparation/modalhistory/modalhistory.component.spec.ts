import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalhistoryComponent } from './modalhistory.component';

describe('ModalhistoryComponent', () => {
  let component: ModalhistoryComponent;
  let fixture: ComponentFixture<ModalhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
