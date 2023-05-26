import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketPkmDetComponent } from './paket-pkm-det.component';

describe('PaketPkmDetComponent', () => {
  let component: PaketPkmDetComponent;
  let fixture: ComponentFixture<PaketPkmDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketPkmDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketPkmDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
