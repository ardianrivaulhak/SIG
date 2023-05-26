import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdocsComponent } from './edocs.component';

describe('EdocsComponent', () => {
  let component: EdocsComponent;
  let fixture: ComponentFixture<EdocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
