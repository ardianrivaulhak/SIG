import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatDetComponent } from './contract-stat-det.component';

describe('ContractStatDetComponent', () => {
  let component: ContractStatDetComponent;
  let fixture: ComponentFixture<ContractStatDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractStatDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStatDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
