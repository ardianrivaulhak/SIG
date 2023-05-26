import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendresultqcComponent } from './sendresultqc.component';

describe('SendresultqcComponent', () => {
  let component: SendresultqcComponent;
  let fixture: ComponentFixture<SendresultqcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendresultqcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendresultqcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
