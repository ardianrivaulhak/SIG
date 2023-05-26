import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodeComponent } from './metode.component';

describe('MetodeComponent', () => {
  let component: MetodeComponent;
  let fixture: ComponentFixture<MetodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
