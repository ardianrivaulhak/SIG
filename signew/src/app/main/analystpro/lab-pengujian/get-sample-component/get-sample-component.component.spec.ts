import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSampleComponentComponent } from './get-sample-component.component';

describe('GetSampleComponentComponent', () => {
  let component: GetSampleComponentComponent;
  let fixture: ComponentFixture<GetSampleComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSampleComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSampleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
