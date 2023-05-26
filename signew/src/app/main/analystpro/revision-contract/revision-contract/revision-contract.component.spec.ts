import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionContractComponent } from './revision-contract.component';

describe('RevisionContractComponent', () => {
  let component: RevisionContractComponent;
  let fixture: ComponentFixture<RevisionContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
