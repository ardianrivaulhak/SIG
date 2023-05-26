import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendaliDetailComponent } from './kendali-detail.component';

describe('KendaliDetailComponent', () => {
  let component: KendaliDetailComponent;
  let fixture: ComponentFixture<KendaliDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendaliDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendaliDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
