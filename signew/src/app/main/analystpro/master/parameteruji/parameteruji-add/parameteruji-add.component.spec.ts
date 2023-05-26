import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterujiAddComponent } from './parameteruji-add.component';

describe('ParameterujiAddComponent', () => {
  let component: ParameterujiAddComponent;
  let fixture: ComponentFixture<ParameterujiAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterujiAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterujiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
