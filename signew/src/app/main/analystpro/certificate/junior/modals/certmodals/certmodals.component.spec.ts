import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertmodalsComponent } from './certmodals.component';

describe('CertmodalsComponent', () => {
  let component: CertmodalsComponent;
  let fixture: ComponentFixture<CertmodalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertmodalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertmodalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
