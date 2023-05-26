import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewersDocumentComponent } from './viewers-document.component';

describe('ViewersDocumentComponent', () => {
  let component: ViewersDocumentComponent;
  let fixture: ComponentFixture<ViewersDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewersDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewersDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
