import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsocomplainComponent } from './csocomplain.component';

describe('CsocomplainComponent', () => {
  let component: CsocomplainComponent;
  let fixture: ComponentFixture<CsocomplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsocomplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsocomplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
