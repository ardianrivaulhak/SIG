import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateattachmentComponent } from './updateattachment.component';

describe('UpdateattachmentComponent', () => {
  let component: UpdateattachmentComponent;
  let fixture: ComponentFixture<UpdateattachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateattachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateattachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
