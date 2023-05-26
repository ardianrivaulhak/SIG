import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketparameterDetComponent } from './paketparameter-det.component';

describe('PaketparameterDetComponent', () => {
  let component: PaketparameterDetComponent;
  let fixture: ComponentFixture<PaketparameterDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketparameterDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketparameterDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
