import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NontechnicalComponent } from './nontechnical.component';

describe('NontechnicalComponent', () => {
  let component: NontechnicalComponent;
  let fixture: ComponentFixture<NontechnicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NontechnicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NontechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
