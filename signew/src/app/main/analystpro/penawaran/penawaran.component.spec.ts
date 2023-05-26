import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenawaranComponent } from './penawaran.component';

describe('PenawaranComponent', () => {
  let component: PenawaranComponent;
  let fixture: ComponentFixture<PenawaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenawaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenawaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
