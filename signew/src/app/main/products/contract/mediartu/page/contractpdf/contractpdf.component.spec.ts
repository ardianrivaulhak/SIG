import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractpdfComponent } from './contractpdf.component';

describe('ContractpdfComponent', () => {
  let component: ContractpdfComponent;
  let fixture: ComponentFixture<ContractpdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractpdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
