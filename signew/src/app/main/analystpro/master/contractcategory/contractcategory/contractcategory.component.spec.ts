import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractcategoryComponent } from './contractcategory.component';

describe('ContractcategoryComponent', () => {
  let component: ContractcategoryComponent;
  let fixture: ComponentFixture<ContractcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
