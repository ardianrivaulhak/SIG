import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentproductComponent } from './attachmentproduct.component';

describe('AttachmentproductComponent', () => {
  let component: AttachmentproductComponent;
  let fixture: ComponentFixture<AttachmentproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
