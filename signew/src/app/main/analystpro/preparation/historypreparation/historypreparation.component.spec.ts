import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorypreparationComponent } from './historypreparation.component';

describe('HistorypreparationComponent', () => {
  let component: HistorypreparationComponent;
  let fixture: ComponentFixture<HistorypreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorypreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorypreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
