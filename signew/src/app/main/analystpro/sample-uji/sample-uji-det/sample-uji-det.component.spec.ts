import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleUjiDetComponent } from './sample-uji-det.component';

describe('SampleUjiDetComponent', () => {
  let component: SampleUjiDetComponent;
  let fixture: ComponentFixture<SampleUjiDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleUjiDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleUjiDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
