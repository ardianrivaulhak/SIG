import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSampleDataComponent } from './get-sample-data.component';

describe('GetSampleDataComponent', () => {
  let component: GetSampleDataComponent;
  let fixture: ComponentFixture<GetSampleDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSampleDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSampleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
