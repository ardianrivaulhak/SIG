import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractDetComponent } from './view-contract-det.component';

describe('ViewContractDetComponent', () => {
  let component: ViewContractDetComponent;
  let fixture: ComponentFixture<ViewContractDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContractDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
