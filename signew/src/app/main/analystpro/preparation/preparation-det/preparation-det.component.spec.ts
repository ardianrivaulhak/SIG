import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationDetComponent } from './preparation-det.component';

describe('PreparationDetComponent', () => {
  let component: PreparationDetComponent;
  let fixture: ComponentFixture<PreparationDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
