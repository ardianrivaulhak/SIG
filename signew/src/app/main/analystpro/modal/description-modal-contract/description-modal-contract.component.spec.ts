import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionModalContractComponent } from './description-modal-contract.component';

describe('DescriptionModalContractComponent', () => {
  let component: DescriptionModalContractComponent;
  let fixture: ComponentFixture<DescriptionModalContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionModalContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionModalContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
