import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenawaranViewComponent } from './penawaran-view.component';

describe('PenawaranViewComponent', () => {
  let component: PenawaranViewComponent;
  let fixture: ComponentFixture<PenawaranViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenawaranViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenawaranViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
