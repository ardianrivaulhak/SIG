import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedocumentsComponent } from './updatedocuments.component';

describe('UpdatedocumentsComponent', () => {
  let component: UpdatedocumentsComponent;
  let fixture: ComponentFixture<UpdatedocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
