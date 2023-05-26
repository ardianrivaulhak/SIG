import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionModalsComponent } from './description-modals.component';

describe('DescriptionModalsComponent', () => {
  let component: DescriptionModalsComponent;
  let fixture: ComponentFixture<DescriptionModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
