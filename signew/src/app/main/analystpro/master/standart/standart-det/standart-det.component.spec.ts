import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandartDetComponent } from './standart-det.component';

describe('StandartDetComponent', () => {
  let component: StandartDetComponent;
  let fixture: ComponentFixture<StandartDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandartDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandartDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
