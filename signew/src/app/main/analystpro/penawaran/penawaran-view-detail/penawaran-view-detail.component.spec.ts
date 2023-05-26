import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenawaranViewDetailComponent } from './penawaran-view-detail.component';

describe('PenawaranViewDetailComponent', () => {
  let component: PenawaranViewDetailComponent;
  let fixture: ComponentFixture<PenawaranViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenawaranViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenawaranViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
