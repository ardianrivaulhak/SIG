import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePartComponent } from './sample-part.component';

describe('SamplePartComponent', () => {
  let component: SamplePartComponent;
  let fixture: ComponentFixture<SamplePartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
