import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetComponent } from './unit-det.component';

describe('UnitDetComponent', () => {
  let component: UnitDetComponent;
  let fixture: ComponentFixture<UnitDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
