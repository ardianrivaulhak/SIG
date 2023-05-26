import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriviewDialogComponent } from './priview-dialog.component';

describe('PriviewDialogComponent', () => {
  let component: PriviewDialogComponent;
  let fixture: ComponentFixture<PriviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
