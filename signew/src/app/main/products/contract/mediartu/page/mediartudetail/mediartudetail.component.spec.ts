import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediartudetailComponent } from './mediartudetail.component';

describe('MediartudetailComponent', () => {
  let component: MediartudetailComponent;
  let fixture: ComponentFixture<MediartudetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediartudetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediartudetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
