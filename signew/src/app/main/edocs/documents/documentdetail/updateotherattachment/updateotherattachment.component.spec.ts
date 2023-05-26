import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateotherattachmentComponent } from './updateotherattachment.component';

describe('UpdateotherattachmentComponent', () => {
  let component: UpdateotherattachmentComponent;
  let fixture: ComponentFixture<UpdateotherattachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateotherattachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateotherattachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
