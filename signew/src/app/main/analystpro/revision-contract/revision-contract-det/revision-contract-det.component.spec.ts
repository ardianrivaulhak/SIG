import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionContractDetComponent } from './revision-contract-det.component';

describe('RevisionContractDetComponent', () => {
  let component: RevisionContractDetComponent;
  let fixture: ComponentFixture<RevisionContractDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionContractDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionContractDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
