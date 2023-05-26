import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AkgModalComponent } from './akg-modal.component';

describe('AkgModalComponent', () => {
  let component: AkgModalComponent;
  let fixture: ComponentFixture<AkgModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AkgModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AkgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
