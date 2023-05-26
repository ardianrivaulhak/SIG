import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketparameterModalComponent } from './paketparameter-modal.component';

describe('PaketparameterModalComponent', () => {
  let component: PaketparameterModalComponent;
  let fixture: ComponentFixture<PaketparameterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketparameterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketparameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
