import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AkgmodalsComponent } from './akgmodals.component';

describe('AkgmodalsComponent', () => {
  let component: AkgmodalsComponent;
  let fixture: ComponentFixture<AkgmodalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AkgmodalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AkgmodalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
