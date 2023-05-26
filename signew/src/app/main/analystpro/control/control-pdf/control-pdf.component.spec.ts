import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPdfComponent } from './control-pdf.component';

describe('ControlPdfComponent', () => {
  let component: ControlPdfComponent;
  let fixture: ComponentFixture<ControlPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
