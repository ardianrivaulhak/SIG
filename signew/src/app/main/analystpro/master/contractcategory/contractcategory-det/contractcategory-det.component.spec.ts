import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractcategoryDetComponent } from './contractcategory-det.component';

describe('ContractcategoryDetComponent', () => {
  let component: ContractcategoryDetComponent;
  let fixture: ComponentFixture<ContractcategoryDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractcategoryDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractcategoryDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
