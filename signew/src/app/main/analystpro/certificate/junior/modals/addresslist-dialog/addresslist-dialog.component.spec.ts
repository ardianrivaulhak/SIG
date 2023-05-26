import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresslistDialogComponent } from './addresslist-dialog.component';

describe('AddresslistDialogComponent', () => {
  let component: AddresslistDialogComponent;
  let fixture: ComponentFixture<AddresslistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresslistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresslistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
