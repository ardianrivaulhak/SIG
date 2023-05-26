import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractComponent } from './preview-contract.component';

describe('PreviewContractComponent', () => {
  let component: PreviewContractComponent;
  let fixture: ComponentFixture<PreviewContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
