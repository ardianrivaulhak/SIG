import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaincertComponent } from './complaincert.component';

describe('ComplaincertComponent', () => {
  let component: ComplaincertComponent;
  let fixture: ComponentFixture<ComplaincertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaincertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaincertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
