import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AkgComponent } from './akg.component';

describe('AkgComponent', () => {
  let component: AkgComponent;
  let fixture: ComponentFixture<AkgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AkgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
