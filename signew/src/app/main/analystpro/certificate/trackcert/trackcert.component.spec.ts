import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackcertComponent } from './trackcert.component';

describe('TrackcertComponent', () => {
  let component: TrackcertComponent;
  let fixture: ComponentFixture<TrackcertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackcertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackcertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
