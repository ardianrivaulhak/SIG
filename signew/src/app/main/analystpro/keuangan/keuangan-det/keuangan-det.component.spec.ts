import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeuanganDetComponent } from './keuangan-det.component';

describe('KeuanganDetComponent', () => {
  let component: KeuanganDetComponent;
  let fixture: ComponentFixture<KeuanganDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeuanganDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeuanganDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
