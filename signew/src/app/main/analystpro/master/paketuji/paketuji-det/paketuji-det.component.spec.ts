import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaketujiDetComponent } from './paketuji-det.component';

describe('PaketujiDetComponent', () => {
  let component: PaketujiDetComponent;
  let fixture: ComponentFixture<PaketujiDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaketujiDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaketujiDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
