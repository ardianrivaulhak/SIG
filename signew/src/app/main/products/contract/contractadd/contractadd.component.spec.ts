import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractaddComponent } from './contractadd.component';

describe('ContractaddComponent', () => {
  let component: ContractaddComponent;
  let fixture: ComponentFixture<ContractaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
