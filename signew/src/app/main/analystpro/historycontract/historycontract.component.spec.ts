import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorycontractComponent } from './historycontract.component';

describe('HistorycontractComponent', () => {
  let component: HistorycontractComponent;
  let fixture: ComponentFixture<HistorycontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorycontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorycontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
