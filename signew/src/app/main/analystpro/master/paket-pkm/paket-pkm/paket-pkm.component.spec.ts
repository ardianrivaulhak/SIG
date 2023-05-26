import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketPkmComponent } from './paket-pkm.component';

describe('PaketPkmComponent', () => {
  let component: PaketPkmComponent;
  let fixture: ComponentFixture<PaketPkmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketPkmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketPkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
