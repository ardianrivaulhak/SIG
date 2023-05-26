import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultmodalcomplainComponent } from './resultmodalcomplain.component';

describe('ResultmodalcomplainComponent', () => {
  let component: ResultmodalcomplainComponent;
  let fixture: ComponentFixture<ResultmodalcomplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultmodalcomplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultmodalcomplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
