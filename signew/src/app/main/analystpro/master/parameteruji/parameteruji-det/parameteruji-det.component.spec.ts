import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterujiDetComponent } from './parameteruji-det.component';

describe('ParameterujiDetComponent', () => {
  let component: ParameterujiDetComponent;
  let fixture: ComponentFixture<ParameterujiDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterujiDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterujiDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
