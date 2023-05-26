import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultofanalysisComponent } from './resultofanalysis.component';

describe('ResultofanalysisComponent', () => {
  let component: ResultofanalysisComponent;
  let fixture: ComponentFixture<ResultofanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultofanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultofanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
