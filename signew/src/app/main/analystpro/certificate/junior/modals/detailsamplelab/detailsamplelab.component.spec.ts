import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsamplelabComponent } from './detailsamplelab.component';

describe('DetailsamplelabComponent', () => {
  let component: DetailsamplelabComponent;
  let fixture: ComponentFixture<DetailsamplelabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsamplelabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsamplelabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
