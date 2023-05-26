import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeInformationComponent } from './administrative-information.component';

describe('AdministrativeInformationComponent', () => {
  let component: AdministrativeInformationComponent;
  let fixture: ComponentFixture<AdministrativeInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrativeInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
