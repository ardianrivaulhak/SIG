import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediartuComponent } from './mediartu.component';

describe('MediartuComponent', () => {
  let component: MediartuComponent;
  let fixture: ComponentFixture<MediartuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediartuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediartuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
