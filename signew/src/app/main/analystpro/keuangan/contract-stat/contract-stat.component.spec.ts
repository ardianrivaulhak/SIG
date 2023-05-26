/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContractStatComponent } from './contract-stat.component';

describe('ContrctStatComponent', () => {
  let component: ContractStatComponent;
  let fixture: ComponentFixture<ContractStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
