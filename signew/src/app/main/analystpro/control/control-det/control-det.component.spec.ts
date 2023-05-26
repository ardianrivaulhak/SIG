import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDetComponent } from './control-det.component';

describe('ControlDetComponent', () => {
  let component: ControlDetComponent;
  let fixture: ComponentFixture<ControlDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
