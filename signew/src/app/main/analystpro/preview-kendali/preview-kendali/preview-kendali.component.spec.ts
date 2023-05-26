import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewKendaliComponent } from './preview-kendali.component';

describe('PreviewKendaliComponent', () => {
  let component: PreviewKendaliComponent;
  let fixture: ComponentFixture<PreviewKendaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewKendaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewKendaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
