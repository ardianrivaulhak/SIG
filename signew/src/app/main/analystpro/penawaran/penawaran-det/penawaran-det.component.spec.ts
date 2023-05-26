import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenawaranDetComponent } from './penawaran-det.component';

describe('PenawaranDetComponent', () => {
  let component: PenawaranDetComponent;
  let fixture: ComponentFixture<PenawaranDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenawaranDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenawaranDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
