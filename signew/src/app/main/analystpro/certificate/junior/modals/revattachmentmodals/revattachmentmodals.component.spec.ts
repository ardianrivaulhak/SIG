import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevattachmentmodalsComponent } from './revattachmentmodals.component';

describe('RevattachmentmodalsComponent', () => {
  let component: RevattachmentmodalsComponent;
  let fixture: ComponentFixture<RevattachmentmodalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevattachmentmodalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevattachmentmodalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
