import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisiondataComponent } from './revisiondata.component';

describe('RevisiondataComponent', () => {
  let component: RevisiondataComponent;
  let fixture: ComponentFixture<RevisiondataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisiondataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
