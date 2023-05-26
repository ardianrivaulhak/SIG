import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleModalsComponent } from './sample-modals.component';

describe('SampleModalsComponent', () => {
  let component: SampleModalsComponent;
  let fixture: ComponentFixture<SampleModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
