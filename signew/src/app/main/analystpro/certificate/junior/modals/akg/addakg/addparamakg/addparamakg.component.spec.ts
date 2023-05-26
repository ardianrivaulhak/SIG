import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParamAkgComponent } from './addparamakg.component';

describe('AkgmodalsComponent', () => {
  let component: AddParamAkgComponent;
  let fixture: ComponentFixture<AddParamAkgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParamAkgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParamAkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
