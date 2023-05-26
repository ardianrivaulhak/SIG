import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSamplePartComponent } from './photo-sample-part.component';

describe('PhotoSamplePartComponent', () => {
  let component: PhotoSamplePartComponent;
  let fixture: ComponentFixture<PhotoSamplePartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoSamplePartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSamplePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
