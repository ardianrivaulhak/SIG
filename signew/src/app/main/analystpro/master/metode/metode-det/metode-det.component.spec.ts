import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodeDetComponent } from './metode-det.component';

describe('MetodeDetComponent', () => {
  let component: MetodeDetComponent;
  let fixture: ComponentFixture<MetodeDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodeDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodeDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
