import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoModalsComponent } from './photo-modals.component';

describe('PhotoModalsComponent', () => {
  let component: PhotoModalsComponent;
  let fixture: ComponentFixture<PhotoModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
