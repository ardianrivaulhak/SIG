import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AkgDetComponent } from './akg-det.component';

describe('AkgDetComponent', () => {
  let component: AkgDetComponent;
  let fixture: ComponentFixture<AkgDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AkgDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AkgDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
