import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoParamComponent } from './info-param.component';

describe('InfoParamComponent', () => {
  let component: InfoParamComponent;
  let fixture: ComponentFixture<InfoParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
