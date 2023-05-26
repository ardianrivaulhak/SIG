import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTrackComponent } from './contract-track.component';

describe('ContractTrackComponent', () => {
  let component: ContractTrackComponent;
  let fixture: ComponentFixture<ContractTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
