import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketparameterComponent } from './paketparameter.component';

describe('PaketparameterComponent', () => {
  let component: PaketparameterComponent;
  let fixture: ComponentFixture<PaketparameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketparameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketparameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
