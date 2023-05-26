/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KendaliComponent } from './kendali.component';

describe('KendaliComponent', () => {
  let component: KendaliComponent;
  let fixture: ComponentFixture<KendaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
