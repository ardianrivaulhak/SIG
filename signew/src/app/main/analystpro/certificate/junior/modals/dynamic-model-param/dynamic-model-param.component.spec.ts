import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModelParamComponent } from './dynamic-model-param.component';

describe('DynamicModelParamComponent', () => {
  let component: DynamicModelParamComponent;
  let fixture: ComponentFixture<DynamicModelParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicModelParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicModelParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
