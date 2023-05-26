import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DioxineComponent } from './dioxine.component';

describe('DioxineComponent', () => {
  let component: DioxineComponent;
  let fixture: ComponentFixture<DioxineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DioxineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DioxineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
