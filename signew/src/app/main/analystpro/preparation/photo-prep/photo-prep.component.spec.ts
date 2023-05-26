import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPrepComponent } from './photo-prep.component';

describe('PhotoPrepComponent', () => {
  let component: PhotoPrepComponent;
  let fixture: ComponentFixture<PhotoPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
