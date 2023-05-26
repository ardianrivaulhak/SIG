import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPartComponent } from './contract-part.component';

describe('ContractPartComponent', () => {
  let component: ContractPartComponent;
  let fixture: ComponentFixture<ContractPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
