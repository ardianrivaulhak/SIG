import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusActiveComponent } from './status-active.component';

describe('StatusActiveComponent', () => {
  let component: StatusActiveComponent;
  let fixture: ComponentFixture<StatusActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
