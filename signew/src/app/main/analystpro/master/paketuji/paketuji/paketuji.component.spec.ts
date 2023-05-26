import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketujiComponent } from './paketuji.component';

describe('PaketujiComponent', () => {
  let component: PaketujiComponent;
  let fixture: ComponentFixture<PaketujiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketujiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketujiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
