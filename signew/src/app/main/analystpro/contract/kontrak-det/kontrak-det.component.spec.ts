import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontrakDetComponent } from './kontrak-det.component';

describe('KontrakDetComponent', () => {
  let component: KontrakDetComponent;
  let fixture: ComponentFixture<KontrakDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontrakDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontrakDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
