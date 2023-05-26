import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessdocumentComponent } from './accessdocument.component';

describe('AccessdocumentComponent', () => {
  let component: AccessdocumentComponent;
  let fixture: ComponentFixture<AccessdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
