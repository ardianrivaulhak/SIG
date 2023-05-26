import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationmodalsqcComponent } from './informationmodalsqc.component';

describe('InformationmodalsqcComponent', () => {
  let component: InformationmodalsqcComponent;
  let fixture: ComponentFixture<InformationmodalsqcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationmodalsqcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationmodalsqcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
