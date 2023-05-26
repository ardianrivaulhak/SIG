import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldcontractComponent } from './holdcontract.component';

describe('HoldcontractComponent', () => {
  let component: HoldcontractComponent;
  let fixture: ComponentFixture<HoldcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
